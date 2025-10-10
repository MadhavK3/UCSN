import React from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Eye, 
  Users, 
  Award,
  ChevronDown
} from 'lucide-react'

 //Import your team photos - RENAME YOUR IMAGE FILES TO MATCH THESE NAMES:
import MadhavKhobare from "../assets/images/team/madhav-khobare.jpg";
import OmBharambe from "../assets/images/team/om-bharambe.png";
import SidhantMattoo from "../assets/images/team/sidhant-mattoo.png";
import AtharvaLokhande from "../assets/images/team/atharva-lokhande.png";


const About: React.FC = () => {
  const team = [
    {
      name: 'Madhav Khobare',
      role: 'Chief Climate Scientist',
      bio: 'Expert in environmental data analysis and climate modeling',
      image: MadhavKhobare
    },
    {
      name: 'Om Bharambe',
      role: 'Head of Engineering',
      bio: 'Specialist in sustainable infrastructure and smart city solutions',
      image: OmBharambe
    },
    {
      name: 'Sidhant Mattoo',
      role: 'Project Lead & AI Research Director',
      bio: 'Machine learning expert focused on climate resilience applications',
      image: SidhantMattoo
    },
    {
      name: 'Atharva Lokhande',
      role: 'Urban Planning Lead',
      bio: 'Sustainable urban design specialist with expertise in green infrastructure',
      image: AtharvaLokhande
    }
  ]

  const partners = [
    { name: 'UN Environment Programme', logo: '/api/placeholder/120/60' },
    { name: 'World Bank', logo: '/api/placeholder/120/60' },
    { name: 'MIT Urban Planning', logo: '/api/placeholder/120/60' },
    { name: 'Climate Resilience Fund', logo: '/api/placeholder/120/60' }
  ]

  const faqs = [
    {
      question: 'How does the system handle extreme weather events?',
      answer: 'Our AI predictive models can forecast extreme events up to 72 hours in advance, allowing the system to automatically deploy protective measures like raising coastal barriers, activating cooling systems, and redirecting resources to critical areas.'
    },
    {
      question: 'What makes this different from traditional climate adaptation?',
      answer: 'Traditional approaches are often reactive and siloed. Our system is proactive, integrated, and uses real-time data to optimize responses across multiple domains simultaneously, creating a cohesive resilience strategy.'
    },
    {
      question: 'How long does deployment typically take?',
      answer: 'A full city deployment typically takes 12-18 months, including planning, installation, and integration with existing infrastructure. We use modular components that can be deployed incrementally.'
    },
    {
      question: 'What ongoing maintenance is required?',
      answer: 'The system requires minimal maintenance thanks to self-diagnosing IoT components and predictive maintenance algorithms. Most components have 5+ year lifespans and are designed for easy replacement.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            About Urban Climate Shield Network (UCSN)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            We're building the future of urban climate resilience through integrated technology solutions
          </motion.p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Target className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              To create urban environments that are resilient, sustainable, and adaptable to the challenges of climate change. We believe technology should serve both people and the planet, creating cities that thrive in harmony with their natural surroundings.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <Eye className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              A world where cities are proactive partners in climate solution, not vulnerable victims of climate change. We envision urban centers that actively improve their local environments while contributing to global climate stability.
            </p>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <Users className="mr-2" size={28} />
              Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Dedicated experts working together to build climate-resilient urban ecosystems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
              >
                {/* Team Member Photo */}
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partners Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Partners
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Collaborating with leading organizations to maximize our impact
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center justify-center h-32"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Award className="text-gray-500" size={24} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{partner.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about our climate resilience system
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <button className="flex items-center justify-between w-full text-left py-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <ChevronDown className="text-gray-500" size={20} />
                </button>
                <p className="text-gray-600 dark:text-gray-300 pb-4">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About