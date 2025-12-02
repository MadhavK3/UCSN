"""
Policy Engine + Safety Checks
Prevents conflicting actions and enforces safety rules
"""
from typing import Dict, List, Optional
from datetime import datetime

class PolicyEngine:
    """
    Policy engine that enforces safety rules and prevents conflicts
    """
    
    def __init__(self):
        self.policies = self._initialize_policies()
        self.safety_checks = self._initialize_safety_checks()
        self.conflict_rules = self._initialize_conflict_rules()
    
    def _initialize_policies(self) -> List[Dict]:
        """Initialize system policies"""
        return [
            {
                "id": "energy_threshold",
                "rule": "Don't raise coastal shields while energy load is below 80% capacity",
                "condition": lambda context, action: (
                    action.get("action") == "RAISE_COASTAL_BARRIERS" and
                    context.get("energy_load", 0) / 6000 < 0.8
                ),
                "action": "BLOCK",
                "reason": "Energy capacity sufficient, barriers not needed"
            },
            {
                "id": "cooling_during_peak",
                "rule": "Don't trigger cooling nodes during peak energy load (>90%)",
                "condition": lambda context, action: (
                    "COOLING" in action.get("action", "") and
                    context.get("energy_load", 0) / 6000 > 0.9
                ),
                "action": "DEFER",
                "reason": "Peak energy load - defer cooling to avoid grid overload"
            },
            {
                "id": "conflicting_barriers",
                "rule": "Don't raise and lower barriers simultaneously",
                "condition": lambda context, action: (
                    action.get("action") == "LOWER_COASTAL_BARRIERS" and
                    any(a.get("action") == "RAISE_COASTAL_BARRIERS" for a in context.get("pending_actions", []))
                ),
                "action": "BLOCK",
                "reason": "Conflicting barrier actions detected"
            },
            {
                "id": "emergency_override",
                "rule": "Allow critical actions even during high energy load if risk is critical",
                "condition": lambda context, action: (
                    action.get("priority") == "CRITICAL" and
                    context.get("energy_load", 0) / 6000 > 0.9
                ),
                "action": "ALLOW",
                "reason": "Critical risk overrides energy constraints"
            },
            {
                "id": "aqi_cooling_conflict",
                "rule": "Don't activate cooling if AQI is critical (cooling may worsen air quality)",
                "condition": lambda context, action: (
                    "COOLING" in action.get("action", "") and
                    context.get("aqi", 0) > 200
                ),
                "action": "MODIFY",
                "modification": lambda action: {
                    **action,
                    "action": "ACTIVATE_COOLING_WITH_AIR_FILTER",
                    "reason": action.get("reason", "") + " (with air filtration)"
                },
                "reason": "Cooling activated with air filtration due to high AQI"
            }
        ]
    
    def _initialize_safety_checks(self) -> List[Dict]:
        """Initialize safety checks"""
        return [
            {
                "id": "energy_capacity",
                "check": lambda context: context.get("energy_load", 0) < 6000,
                "message": "Energy capacity check passed"
            },
            {
                "id": "system_health",
                "check": lambda context: context.get("system_health", "operational") == "operational",
                "message": "System health check passed"
            },
            {
                "id": "sensor_connectivity",
                "check": lambda context: context.get("sensor_connectivity", 0.95) > 0.8,
                "message": "Sensor connectivity check passed"
            }
        ]
    
    def _initialize_conflict_rules(self) -> List[Dict]:
        """Initialize conflict resolution rules"""
        return [
            {
                "conflict_type": "energy_conflict",
                "rule": "If total energy impact exceeds capacity, prioritize by agent priority",
                "resolve": lambda actions, context: self._resolve_energy_conflict(actions, context)
            },
            {
                "conflict_type": "zone_conflict",
                "rule": "If multiple actions target same zone, combine or prioritize",
                "resolve": lambda actions, context: self._resolve_zone_conflict(actions, context)
            },
            {
                "conflict_type": "action_conflict",
                "rule": "If actions conflict (e.g., raise/lower), prioritize higher priority",
                "resolve": lambda actions, context: self._resolve_action_conflict(actions, context)
            }
        ]
    
    def validate_action(self, action: Dict, context: Dict) -> Dict:
        """
        Validate a single action against policies
        """
        violations = []
        modifications = []
        
        for policy in self.policies:
            if policy["condition"](context, action):
                if policy["action"] == "BLOCK":
                    violations.append({
                        "policy_id": policy["id"],
                        "rule": policy["rule"],
                        "reason": policy.get("reason", "Policy violation")
                    })
                elif policy["action"] == "DEFER":
                    return {
                        "valid": False,
                        "action": "DEFER",
                        "reason": policy.get("reason", "Action deferred by policy")
                    }
                elif policy["action"] == "MODIFY":
                    if "modification" in policy:
                        action = policy["modification"](action)
                        modifications.append({
                            "policy_id": policy["id"],
                            "modification": policy.get("reason", "Action modified by policy")
                        })
        
        # Run safety checks
        safety_results = []
        for check in self.safety_checks:
            if not check["check"](context):
                safety_results.append({
                    "check_id": check["id"],
                    "passed": False,
                    "message": f"Safety check failed: {check['id']}"
                })
            else:
                safety_results.append({
                    "check_id": check["id"],
                    "passed": True,
                    "message": check["message"]
                })
        
        all_safe = all(r["passed"] for r in safety_results)
        
        return {
            "valid": len(violations) == 0 and all_safe,
            "violations": violations,
            "modifications": modifications,
            "safety_checks": safety_results,
            "action": action
        }
    
    def resolve_conflicts(self, actions: List[Dict], context: Dict) -> List[Dict]:
        """
        Resolve conflicts between multiple actions
        """
        # Validate each action
        validated_actions = []
        for action in actions:
            validation = self.validate_action(action, context)
            if validation["valid"]:
                validated_actions.append(validation["action"])
            elif validation.get("action") == "DEFER":
                # Store deferred actions for later
                pass
        
        # Apply conflict resolution rules
        resolved = validated_actions
        for conflict_rule in self.conflict_rules:
            resolved = conflict_rule["resolve"](resolved, context)
        
        return resolved
    
    def _resolve_energy_conflict(self, actions: List[Dict], context: Dict) -> List[Dict]:
        """Resolve energy capacity conflicts"""
        current_load = context.get("energy_load", 4500)
        max_capacity = 6000
        available = max_capacity - current_load
        
        total_impact = sum(a.get("energy_impact_mw", 0) for a in actions)
        
        if total_impact <= available:
            return actions
        
        # Prioritize by action priority
        priority_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
        sorted_actions = sorted(actions, key=lambda x: priority_order.get(x.get("priority", "LOW"), 3))
        
        resolved = []
        cumulative_impact = 0
        
        for action in sorted_actions:
            impact = action.get("energy_impact_mw", 0)
            if cumulative_impact + impact <= available:
                resolved.append(action)
                cumulative_impact += impact
            else:
                # Modify action to fit within capacity
                if action.get("priority") == "CRITICAL":
                    # Reduce scope but keep action
                    modified = {**action, "energy_impact_mw": available - cumulative_impact, "scope_reduced": True}
                    resolved.append(modified)
                    break
        
        return resolved
    
    def _resolve_zone_conflict(self, actions: List[Dict], context: Dict) -> List[Dict]:
        """Resolve zone conflicts"""
        zone_actions = {}
        
        for action in actions:
            zones = action.get("zones", "unknown")
            if zones not in zone_actions:
                zone_actions[zones] = []
            zone_actions[zones].append(action)
        
        resolved = []
        for zones, zone_actions_list in zone_actions.items():
            if len(zone_actions_list) == 1:
                resolved.append(zone_actions_list[0])
            else:
                # Multiple actions for same zone - prioritize
                priority_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
                sorted_zone_actions = sorted(zone_actions_list, key=lambda x: priority_order.get(x.get("priority", "LOW"), 3))
                resolved.append(sorted_zone_actions[0])  # Take highest priority
        
        return resolved
    
    def _resolve_action_conflict(self, actions: List[Dict], context: Dict) -> List[Dict]:
        """Resolve conflicting actions (e.g., raise vs lower)"""
        # Check for conflicting action pairs
        conflicts = {
            ("RAISE_COASTAL_BARRIERS", "LOWER_COASTAL_BARRIERS"),
            ("ACTIVATE_COOLING", "DEACTIVATE_COOLING"),
        }
        
        resolved = []
        seen_conflicts = set()
        
        for action in actions:
            action_name = action.get("action", "")
            conflict_found = False
            
            for conflict_pair in conflicts:
                if action_name in conflict_pair:
                    other_action = [a for a in actions if a.get("action") in conflict_pair and a.get("action") != action_name]
                    if other_action:
                        conflict_key = tuple(sorted([action_name, other_action[0].get("action")]))
                        if conflict_key not in seen_conflicts:
                            # Resolve by priority
                            priority_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
                            if priority_order.get(action.get("priority", "LOW"), 3) <= priority_order.get(other_action[0].get("priority", "LOW"), 3):
                                resolved.append(action)
                                seen_conflicts.add(conflict_key)
                                conflict_found = True
                                break
            
            if not conflict_found:
                resolved.append(action)
        
        return resolved

def get_policy_engine() -> PolicyEngine:
    """Get policy engine instance"""
    return PolicyEngine()

