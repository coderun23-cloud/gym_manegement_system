import { motion } from "framer-motion";

const Notice = () => {
  const announcements = [
    {
      title: "New Yoga Classes",
      date: "July 15, 2023",
      description: "Starting next week, we're introducing daily yoga sessions.",
    },
    {
      title: "Extended Hours",
      date: "July 10, 2023",
      description: "We're now open from 5 AM to 11 PM on weekdays.",
    },
    {
      title: "Member Appreciation Day",
      date: "July 5, 2023",
      description: "Free smoothies for all members this Friday!",
    },
  ];

  return (
    <section id="notice" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Gym Notices</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, events, and special offers at MAV
            GYM PLC.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-100 p-6 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{announcement.title}</h3>
                  <p className="text-gray-500 text-sm">{announcement.date}</p>
                </div>
              </div>
              <p className="text-gray-700">{announcement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Notice;
