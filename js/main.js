// // main.js
// document.addEventListener('DOMContentLoaded', () => {
//     // Smooth scrolling for navigation links
//     document.querySelectorAll('nav a').forEach(anchor => {
//       anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         document.querySelector(this.getAttribute('href')).scrollIntoView({
//           behavior: 'smooth'
//         });
//       });
//     });

//     // Hero section text animation
//     const heroText = document.querySelector('.hero-content h2');
//     let text = heroText.textContent;
//     heroText.textContent = '';
//     let i = 0;

//     function typeEffect() {
//       if (i < text.length) {
//         heroText.textContent += text.charAt(i);
//         i++;
//         setTimeout(typeEffect, 100);
//       }
//     }
//     typeEffect();

//     // Scroll animation for sections
//     const sections = document.querySelectorAll('#about, #packages, #contact');
//     const options = {
//       threshold: 0.1
//     };

//     const observer = new IntersectionObserver((entries, observer) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('visible');
//           observer.unobserve(entry.target);
//         }
//       });
//     }, options);

//     sections.forEach(section => {
//       section.classList.add('hidden');
//       observer.observe(section);
//     });
//   });


//   // main.js
// gsap.registerPlugin(ScrollTrigger);

// document.addEventListener('DOMContentLoaded', () => {
//   // Smooth scrolling with GSAP
//   gsap.utils.toArray('nav a').forEach(link => {
//     link.addEventListener('click', function (e) {
//       e.preventDefault();
//       gsap.to(window, {
//         duration: 1,
//         scrollTo: this.getAttribute('href'),
//         ease: 'power2.out'
//       });
//     });
//   });

//   // Hero text animation
//   gsap.from('.hero-content h2', {
//     opacity: 0,
//     y: 50,
//     duration: 1.5,
//     delay: 0.5,
//     ease: 'power3.out'
//   });

//   gsap.from('.hero-content p', {
//     opacity: 0,
//     y: 30,
//     duration: 1,
//     delay: 1,
//     ease: 'power3.out'
//   });

//   gsap.from('.btn', {
//     opacity: 0,
//     scale: 0.8,
//     duration: 1,
//     delay: 1.5,
//     ease: 'elastic.out(1, 0.5)'
//   });

//   // Scroll-triggered animations for sections
//   gsap.utils.toArray('#about, #packages, #contact').forEach(section => {
//     gsap.from(section, {
//       scrollTrigger: {
//         trigger: section,
//         start: 'top 80%',
//         toggleActions: 'play none none none'
//       },
//       opacity: 0,
//       y: 50,
//       duration: 1,
//       ease: 'power2.out'
//     });
//   });
// });


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


(function () {
  // https://dashboard.emailjs.com/admin/account
  emailjs.init({
    publicKey: "a3zspDxYYQJ8sCiVN",
  });
})();
window.onload = function () {
  document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();
    // these IDs from the previous steps
    emailjs.sendForm('service_4y06o5p', 'template_qlyxfxl1', this)
      .then(() => {
        console.log('SUCCESS!');
        alert("Developer Contact you Soon!");
      }, (error) => {
        console.log('FAILED...', error);
        alert("Internal Server Error Occured");
      });
  });
}