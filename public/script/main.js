
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  gsap.from('.hero-content h2', {
    opacity: 0,
    y: -50,
    duration: 1.5,
    ease: 'power3.out'
  });

  gsap.from('.hero-content p', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
  });

  gsap.from('.btn', {
    opacity: 0,
    scale: 0.8,
    duration: 1.5,
    delay: 1,
    ease: 'elastic.out(1, 0.5)'
  });

  gsap.utils.toArray('#about, #packages, #contact').forEach(section => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 100,
      duration: 1.2,
      ease: 'power2.out'
    });
  });
});


// (function () {
//   // https://dashboard.emailjs.com/admin/account
//   emailjs.init({
//     publicKey: "a3zspDxYYQJ8sCiVN",
//   });
// })();
// window.onload = function () {
//   document.getElementById('contact-form').addEventListener('submit', function (event) {
//     event.preventDefault();
//     // these IDs from the previous steps
//     emailjs.sendForm('service_4y06o5p', 'template_qlyxfxl1', this)
//       .then(() => {
//         console.log('SUCCESS!');
//         alert("Developer Contact you Soon!");
//       }, (error) => {
//         console.log('FAILED...', error);
//         alert("Internal Server Error Occured");
//       });
//   });
// }