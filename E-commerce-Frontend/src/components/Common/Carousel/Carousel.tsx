import { useEffect, useRef, type JSX } from "react";
import userUtils from "../../../Utils/User/User.util";

interface CarouselProps {
  images: string[];
  hover: boolean;
  setCarouselIndex: (carouselIndex: (index: number)=>number) => void;
  wishListBoxHeight: number;
}

const Carousel = ({
  images,
  hover,
  setCarouselIndex,
  wishListBoxHeight,
}: CarouselProps): JSX.Element => {
  const slidesWrapper = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const len = images.length;

  const moveSlides = (offset: number) => {
    const wrapper = slidesWrapper.current;
    if (wrapper) {
      for (let index = 0; index < wrapper.children.length; index++) {
        const child = wrapper.children[index] as HTMLElement;
        child.style.left = `${(index + offset) * 100}%`;
      }
    }
  };

  const slideRight = () => {
    const wrapper = slidesWrapper.current;
    if (!wrapper) return;

    setCarouselIndex((prev : number) => {
      const newCounter : number = prev > len - 2 ? 0 : prev + 1;

      moveSlides(-2);

      if (wrapper.firstElementChild) {
        wrapper.removeChild(wrapper.firstElementChild);
      }

      const firstClone = wrapper.children[0].cloneNode(true) as HTMLElement;
      wrapper.appendChild(firstClone);
      firstClone.style.left = `${(len - 1) * 100}%`;

      return newCounter;
    });
  };

  const startAutoSlide = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(slideRight, 1000);
    }
  };

  const stopAutoSlideAndReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    resetCarousel();
  };

  const resetCarousel = () => {
    const wrapper = slidesWrapper.current;
    if (!wrapper) return;

    wrapper.innerHTML = "";

    images.forEach((imgLink, index) => {
      const el = document.createElement("img");
      el.src = imgLink;
      el.className = "absolute w-full h-full transition-all duration-700";
      el.style.left = `${index * 100}%`;
      wrapper.appendChild(el);
    });

    if (wrapper.children.length > 0) {
      const lastClone = wrapper.children[len - 1].cloneNode(true) as HTMLElement;
      wrapper.insertBefore(lastClone, wrapper.children[0]);
      lastClone.style.left = "-100%";
    }

    setCarouselIndex(()=>{
      return 0;
    });
  };

  useEffect(() => {
    if (hover) {
      startAutoSlide();
    } else {
      stopAutoSlideAndReset();
    }
  }, [hover]);

  useEffect(() => {
    resetCarousel();
  }, []);

  return (
    <div className="flex justify-center w-full h-full bg-white">
      <div
        ref={slidesWrapper}
        className="relative w-full transition-all duration-1000"
        style={{
          height: hover
            ? userUtils.isLoggedIn()
              ? `calc(100% - ${wishListBoxHeight - 10}px)`
              : "calc(100% - 20px)"
            : "100%",
        }}
      ></div>
    </div>
  );
};

export default Carousel;