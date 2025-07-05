import { motion } from "framer-motion";

const About = () => {
  const features = [
    {
      title: "Modern Equipment",
      description: "State-of-the-art machines for all your fitness needs.",
      icon: "💪",
    },
    {
      title: "Expert Trainers",
      description: "Certified professionals to guide your fitness journey.",
      icon: "🏋️‍♂️",
    },
    {
      title: "24/7 Access",
      description: "Work out whenever it suits your schedule.",
      icon: "⏰",
    },
    {
      title: "Community",
      description: "Join a supportive network of fitness enthusiasts.",
      icon: "👥",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">About MAV GYM PLC</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're more than just a gym - we're a lifestyle. Our mission is to
            help you unlock your potential and achieve your fitness goals in a
            welcoming, high-energy environment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
