const ScrollyTellingAnimation = (() => {
  const loadAnimation = (obj) => {
      window.isScrollyLoading = true;

      setTimeout(() => {
          const anim = lottie.loadAnimation({
              container: document.querySelector(obj.target),
              renderer: "svg",
              loop: false,
              autoplay: true,
              path: obj.path,
              rendererSettings: {
                  preserveAspectRatio: obj.aspectRatio,
              },
          });
          anim.setSpeed(0.8); //1 is the current speed;

          anim.addEventListener('DOMLoaded', () => {
              if (window.isScrollyLoading) {
                  $(".loader-container").remove();
                  window.isScrollyLoading = false;
              }
          })

      }, 250);
  };

  const loadAnimationWithScrollTrigger = (obj) => {
      const anim = lottie.loadAnimation({
          container: document.querySelector(obj.target),
          renderer: "svg",
          loop: false,
          autoplay: false,
          path: obj.path,
          rendererSettings: {
              preserveAspectRatio: obj.aspectRatio,
          },
      });

      window.isScrollyLoading = true;
      anim.addEventListener('DOMLoaded', () => {
          if (window.isScrollyLoading) {
              $(".loader-container").remove();
              window.isScrollyLoading = false;
          }
      })

      const timeObj = { currentFrame: 0 };
      ScrollTrigger.create({
          trigger: obj.target,
          scrub: true,
          pin: obj.pin,
          start: obj.start,
          end: obj.end,
          onUpdate: (self) => {
              if (obj.duration) {
                  gsap.to(timeObj, {
                      duration: obj.duration,
                      currentFrame:
                          Math.floor(self.progress * (anim.totalFrames - 1)) +
                          obj.startingFrame,
                      onUpdate: () => {
                          anim.goToAndStop(timeObj.currentFrame, true);
                      },
                      ease: "power0.out",
                  });
              } else {
                  anim.goToAndStop(
                      self.progress *
                      (anim.totalFrames - 1 + obj.startingFrame),
                      true
                  );
              }
          },
      });
  };

  const loadAnimationWithScrollTriggerPinned = (obj) => {
      ScrollTrigger.create({
          trigger: obj.target,
          start: obj.start,
          end: obj.end,
          pin: true,
      });
  };

  const playAnimation = (
      target,
      path,
      aspectRatio,
      startingFrame,
      duration,
      start1,
      end1,
      start2,
      end2
  ) => {
      if (end1 === 0 && end2 === 0) {
          loadAnimation({
              target: target,
              path: path,
              aspectRatio: aspectRatio,
          });
      } else if (end2 === 0) {
          loadAnimationWithScrollTrigger({
              target: target,
              path: path,
              aspectRatio: aspectRatio,
              pin: true,
              start: `top ${start1}%`,
              end: `+=${end1}%`,
              startingFrame: startingFrame,
              duration: duration,
          });
      } else {
          loadAnimationWithScrollTrigger({
              target: target,
              path: path,
              aspectRatio: aspectRatio,
              pin: false,
              start: `top ${start1}%`,
              end: `+=${end1}%`,
              startingFrame: startingFrame,
              duration: duration,
          });

          loadAnimationWithScrollTriggerPinned({
              target: target,
              start: `top ${start2}%`,
              end: `+=${end2}%`,
          });
      }
  };

  const init = () => {
      if (!$(".cmp-scrollytelling-animation").length) return;

      gsap.registerPlugin(ScrollTrigger), ScrollSmoother;
      //ScrollTrigger.normalizeScroll(true);
      //ScrollTrigger.config({ ignoreMobileResize: true });
      ScrollSmoother.create({
        smooth: 1,             
        effects: true,           
        smoothTouch: 0.1,        
      });

      document
          .querySelector("html")
          .classList.add("cmp-scrollytelling-animation__show-scroll");

      $(".cmp-scrollytelling-animation").each(function () {
          const animation = $(this);
          const target = `.${animation.attr("data-scrollyTelling-target")}`;
          const startingFrame = parseInt(
              animation.attr("data-scrollyTelling-startingFrame")
          );
          const aspectRatio = animation.attr(
              "data-scrollyTelling-aspectRatio"
          );
          const start1 = parseInt(
              animation.attr("data-scrollyTelling-start1")
          );
          const start2 = parseInt(
              animation.attr("data-scrollyTelling-start2")
          );

          let path = "";
          let duration = 0;
          let backgroundImg = "";
          let end1 = 0;
          let end2 = 0;
          if (window.innerWidth > window.innerHeight) {
              path = animation.attr("data-scrollyTelling-path-desktop");
              duration = parseFloat(
                  animation.attr("data-scrollyTelling-duration-desktop")
              );
              backgroundImg = animation.attr(
                  "data-scrollyTelling-backgroundImg-desktop"
              );
              end1 = parseInt(
                  animation.attr("data-scrollyTelling-end1-desktop")
              );
              end2 = parseInt(
                  animation.attr("data-scrollyTelling-end2-desktop")
              );
          } else {
              path = animation.attr("data-scrollyTelling-path-mobile");
              duration = parseFloat(
                  animation.attr("data-scrollyTelling-duration-mobile")
              );
              backgroundImg = animation.attr(
                  "data-scrollyTelling-backgroundImg-mobile"
              );
              end1 = parseInt(
                  animation.attr("data-scrollyTelling-end1-mobile")
              );
              end2 = parseInt(
                  animation.attr("data-scrollyTelling-end2-mobile")
              );
          }

          if (backgroundImg != null && backgroundImg.length > 0) {
              const targetObj = document.querySelector(target);
              targetObj.style.backgroundImage = `url('${backgroundImg}')`;
              targetObj.classList.add(
                  "cmp-scrollytelling-animation__background"
              );
          }

          playAnimation(
              target,
              path,
              aspectRatio,
              startingFrame,
              duration,
              start1,
              end1,
              start2,
              end2
          );
      });
  };

  return {
      init: function () {
          init();
      },
  };
})();

$(document).ready(() => {
  ScrollyTellingAnimation.init();
});
