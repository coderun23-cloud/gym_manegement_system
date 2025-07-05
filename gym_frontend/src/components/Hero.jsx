import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="home" className="relative bg-gray-900 text-white py-20 h-152">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <br />
          <br />
          <br />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform Your <span className="text-blue-500">Body</span> at MAV
            GYM
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Join the premier fitness destination with state-of-the-art
            equipment, expert trainers, and a community that motivates you to
            achieve your fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="#signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 text-center"
            >
              Join Now
            </Link>
            <Link
              to="#about"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 text-center"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
