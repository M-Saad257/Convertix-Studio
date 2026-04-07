// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { MessageCircle } from "lucide-react";

// export default function WhatsAppButton() {
//   const phoneNumber = "+923016235725";
//   const message = "Hi Convertix Studio! I'm interested in your high-performance services.";

//   const handleClick = () => {
//     const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//     window.open(url, "_blank");
//   };

//   return (
//     <motion.button
//       initial={{ scale: 0, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       whileHover={{ scale: 1.1, rotate: 10 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleClick}
//       className="fixed bottom-10 right-10 z-50 p-5 rounded-full bg-[#25D366] text-white shadow-3xl hover:shadow-[0_0_30px_rgba(37,211,102,0.8)] transition-all duration-500 group"
//     >
//       <MessageCircle className="w-9 h-9 fill-white/20" />

//       {/* Tooltip */}
//       <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 px-6 py-3 bg-white text-black font-black text-[10px] rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-2xl uppercase tracking-widest italic border border-black/10">
//         Direct Strategy Chat
//         <div className="absolute left-full top-1/2 -translate-y-1/2 border-[10px] border-transparent border-l-white" />
//       </div>
//     </motion.button>
//   );
// }
