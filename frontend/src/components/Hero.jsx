import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { assets } from "../assets/assets"

const heroSlides = [
  {
    title: "Department-wise Book Week",
    subtitle: "CSE, IT, ECE, EEE, AIDS",
    cta: "Browse Books",
    description: "Discover syllabus-aligned textbooks and reference guides with faster department filters.",
    image: assets.hero_img,
    badge: "CAMPUS25",
  },
  {
    title: "New Semester Essentials",
    subtitle: "SmartMart Picks",
    cta: "Explore Collections",
    description: "Curated academic titles for every department in one place.",
    image: assets.hero_img_2,
    badge: "STUDENT10",
  },
  {
    title: "Complete Engineering Shelf",
    subtitle: "All Departments",
    cta: "Shop Now",
    description: "From CS to Civil, find core textbooks for every semester and subject.",
    image: assets.hero_img_3,
    badge: "NEW",
  },
]

const Hero = () => {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{ nextEl: ".hero-next", prevEl: ".hero-prev" }}
        pagination={{ clickable: true, bulletClass: "hero-dot", bulletActiveClass: "hero-dot-active" }}
        autoplay={{ delay: 5000 }}
        loop
        className="rounded-3xl overflow-hidden shadow-lg border border-gray-200"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
              <img
                src={slide.image}
                alt="SmartMart"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

              <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 px-6 sm:px-10 lg:px-14 py-10">
                <div className="text-white flex flex-col justify-center gap-4">
                  <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
                    <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">📘</span>
                    {slide.subtitle}
                  </span>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base text-white/90 max-w-xl">
                    {slide.description}
                  </p>

                  <button className="mt-2 w-fit bg-white text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold shadow hover:bg-gray-100">
                    {slide.cta}
                  </button>
                </div>

                <div className="hidden lg:flex items-center justify-end">
                  <div className="relative w-52 h-52">
                    <div className="absolute inset-0 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm" />
                    <div className="absolute inset-6 rounded-full bg-white/25 border border-white/40" />
                    <div className="absolute inset-12 rounded-full bg-white/20 border border-white/30" />
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
                      {slide.badge}
                    </div>
                    <img
                      src={slide.image}
                      alt="promo"
                      className="absolute -top-3 -right-1 w-16 h-16 rounded-2xl object-cover border-2 border-white shadow"
                    />
                    <img
                      src={slide.image}
                      alt="promo"
                      className="absolute bottom-2 left-1 w-14 h-14 rounded-2xl object-cover border-2 border-white shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="hero-prev hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white absolute left-4 top-1/2 -translate-y-1/2 z-20">
        ‹
      </button>
      <button className="hero-next hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white absolute right-4 top-1/2 -translate-y-1/2 z-20">
        ›
      </button>

      <style>{`
        .hero-dot {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 9999px;
          display: inline-block;
          margin: 0 4px;
        }
        .hero-dot-active {
          width: 24px;
          background: #ffffff;
        }
      `}</style>
    </div>
  )
}

export default Hero
