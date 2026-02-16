"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ───────────────────────── constants ───────────────────────── */

const NAV_LINKS = [
  { label: "Tính năng", href: "#features" },
  { label: "Cách hoạt động", href: "#how-it-works" },
  { label: "Bảng giá", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

const PAIN_POINTS = [
  {
    icon: "clock",
    title: "Mất hàng giờ viết ghi chú",
    desc: "Sau mỗi phiên trị liệu 50 phút, bạn lại dành thêm 30–45 phút để hoàn thành ghi chú lâm sàng. Thời gian đó đáng lẽ dành cho thân chủ tiếp theo — hoặc cho chính bạn.",
  },
  {
    icon: "chart",
    title: "Khó theo dõi tiến trình hệ thống",
    desc: "PHQ-9, GAD-7, nhật ký cảm xúc — dữ liệu nằm rải rác trong sổ tay, Excel, và trí nhớ. Bạn biết thân chủ tiến triển, nhưng khó chứng minh bằng con số.",
  },
  {
    icon: "puzzle",
    title: "Quá nhiều công cụ rời rạc",
    desc: "Zoom cho video call, Google Docs cho ghi chú, Excel cho theo dõi tiến trình, app lịch cho đặt hẹn — mỗi bước lại chuyển sang một công cụ khác. Trải nghiệm bị ngắt quãng, dữ liệu phân tán, và bạn mất thời gian chỉ để tìm đúng thông tin.",
  },
  {
    icon: "shield",
    title: "Lo ngại bảo mật dữ liệu",
    desc: "Thông tin thân chủ là tuyệt mật. Bạn không chắc chắn rằng tất cả những ứng dụng bạn đang sử dụng có bảo mật theo tiêu chuẩn quốc tế hay không?",
  },
] as const;

const FEATURES = [
  {
    tag: "Tiết kiệm 2 giờ mỗi ngày",
    title: "AI Session Notes",
    desc: "Kết thúc phiên trị liệu, ghi chú SOAP đã sẵn sàng. AI lắng nghe, tóm tắt, và tạo bản nháp — bạn chỉ cần review và phê duyệt. Giảm 80% thời gian documentation.",
    mockup: "session-notes",
  },
  {
    tag: "Nhìn rõ tiến trình",
    title: "Client Progress Dashboard",
    desc: "Biểu đồ PHQ-9, GAD-7 theo thời gian. Phát hiện xu hướng mà mắt thường dễ bỏ sót. Chia sẻ báo cáo trực quan với thân chủ để tăng động lực trị liệu.",
    mockup: "progress-dashboard",
  },
  {
    tag: "Evidence-based, luôn cập nhật",
    title: "AI Treatment Suggestions",
    desc: "Gợi ý can thiệp dựa trên DSM-5 và các phác đồ trị liệu được chứng minh hiệu quả. Không thay thế chuyên môn — mà hỗ trợ ra quyết định lâm sàng tốt hơn.",
    mockup: "treatment-suggestions",
  },
  {
    tag: "Giảm 60% no-show",
    title: "Smart Scheduling",
    desc: "Lịch hẹn thông minh với nhắc nhở tự động. Kéo thả để đổi lịch. Tổng quan ngày/tuần giúp bạn cân bằng caseload và tránh kiệt sức.",
    mockup: "smart-scheduling",
  },
  {
    tag: "An toàn tuyệt đối",
    title: "Secure Telehealth",
    desc: "Video call mã hóa đầu-cuối, tích hợp ngay trong nền tảng. Ghi âm với consent. Không cần Zoom riêng, Google Meet riêng — tất cả trong một nơi.",
    mockup: "telehealth",
  },
] as const;

const STEPS = [
  {
    num: 1,
    title: "Đăng ký miễn phí",
    desc: "Tạo tài khoản trong 30 giây. Không cần thẻ tín dụng, không cam kết.",
    icon: "user-plus",
  },
  {
    num: 2,
    title: "Thiết lập phòng khám",
    desc: "Nhập thông tin phòng khám, thêm thân chủ hiện tại, hoặc bắt đầu từ đầu.",
    icon: "building",
  },
  {
    num: 3,
    title: "Trị liệu với AI hỗ trợ",
    desc: "Bắt đầu phiên trị liệu — AI ghi chú, theo dõi, và tóm tắt giúp bạn.",
    icon: "sparkles",
  },
  {
    num: 4,
    title: "Xem insights tự động",
    desc: "Sau mỗi phiên, nhận báo cáo tiến trình, gợi ý can thiệp, và kế hoạch tiếp theo.",
    icon: "bar-chart",
  },
] as const;

const PLANS = [
  {
    name: "Starter",
    price: "Miễn phí",
    period: "14 ngày dùng thử",
    desc: "Trải nghiệm đầy đủ tính năng",
    features: [
      "AI Session Notes (không giới hạn)",
      "Client Progress Dashboard",
      "Lên đến 10 thân chủ",
      "Secure video call",
      "Hỗ trợ email",
    ],
    cta: "Bắt đầu miễn phí",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "890.000đ",
    period: "/tháng",
    desc: "Cho chuyên gia độc lập",
    features: [
      "Tất cả tính năng Starter",
      "Thân chủ không giới hạn",
      "AI Treatment Suggestions",
      "Smart Scheduling + nhắc nhở",
      "Xuất báo cáo PDF",
      "Hỗ trợ ưu tiên 24/7",
    ],
    cta: "Dùng thử miễn phí",
    highlighted: true,
  },
  {
    name: "Clinic",
    price: "Liên hệ",
    period: "tùy chỉnh",
    desc: "Cho phòng khám & tổ chức",
    features: [
      "Tất cả tính năng Professional",
      "Nhiều chuyên gia trên 1 tài khoản",
      "Quản lý team & phân quyền",
      "API tích hợp EMR/EHR",
      "Onboarding & đào tạo riêng",
      "SLA cam kết uptime 99.9%",
    ],
    cta: "Liên hệ tư vấn",
    highlighted: false,
  },
] as const;

const FAQS = [
  {
    q: "TherapistAI có an toàn cho dữ liệu thân chủ không?",
    a: "Tuyệt đối. Chúng tôi sử dụng mã hóa AES-256 cho dữ liệu lưu trữ và TLS 1.3 cho dữ liệu truyền tải. Hệ thống tuân thủ tiêu chuẩn bảo mật quốc tế và có audit log cho mọi truy cập dữ liệu. Dữ liệu được lưu trên server tại Việt Nam.",
  },
  {
    q: "Tôi không giỏi công nghệ, có sử dụng được không?",
    a: "TherapistAI được thiết kế cho chuyên gia tâm lý, không phải kỹ sư IT. Giao diện trực quan, hướng dẫn từng bước, và đội ngũ hỗ trợ sẵn sàng giúp bạn. Hầu hết người dùng thành thạo trong buổi đầu tiên.",
  },
  {
    q: "TherapistAI có hỗ trợ tiếng Việt đầy đủ không?",
    a: "Có. Toàn bộ giao diện, AI ghi chú, và gợi ý trị liệu đều hỗ trợ tiếng Việt. AI được huấn luyện để hiểu ngữ cảnh tâm lý lâm sàng tiếng Việt, bao gồm cả thuật ngữ chuyên môn.",
  },
  {
    q: "Chi phí sử dụng như thế nào?",
    a: "Bạn được dùng thử miễn phí 14 ngày với đầy đủ tính năng. Sau đó, gói Professional từ 890.000đ/tháng — tương đương chi phí 1 giờ trị liệu, nhưng tiết kiệm cho bạn hàng chục giờ mỗi tháng.",
  },
  {
    q: "TherapistAI hoạt động trên những thiết bị nào?",
    a: "TherapistAI là ứng dụng web, hoạt động trên mọi thiết bị có trình duyệt: máy tính, laptop, tablet, và điện thoại. Được tối ưu cho Chrome, Firefox, Safari, và Edge.",
  },
  {
    q: "Làm sao để chuyển dữ liệu từ hệ thống cũ sang?",
    a: "Chúng tôi hỗ trợ import dữ liệu từ file Excel, CSV, hoặc từ các hệ thống EMR phổ biến. Đội ngũ kỹ thuật sẽ hỗ trợ bạn miễn phí trong quá trình chuyển đổi.",
  },
  {
    q: "Có đào tạo sử dụng không?",
    a: "Có. Mỗi tài khoản mới nhận được buổi onboarding 1-1 miễn phí (30 phút). Ngoài ra, chúng tôi có video hướng dẫn, tài liệu chi tiết, và webinar hàng tháng về các tính năng mới.",
  },
] as const;

/* ───────────────────────── icons (inline SVG) ───────────────────────── */

function Icon({
  name,
  size = 24,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "chart":
      return (
        <svg {...props}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "puzzle":
      return (
        <svg {...props}>
          <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "user-plus":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      );
    case "building":
      return (
        <svg {...props}>
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" />
          <path d="M16 6h.01" />
          <path d="M12 6h.01" />
          <path d="M12 10h.01" />
          <path d="M12 14h.01" />
          <path d="M16 10h.01" />
          <path d="M16 14h.01" />
          <path d="M8 10h.01" />
          <path d="M8 14h.01" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...props}>
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          <path d="M20 3v4" />
          <path d="M22 5h-4" />
        </svg>
      );
    case "bar-chart":
      return (
        <svg {...props}>
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg {...props}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...props}>
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      );
    case "x":
      return (
        <svg {...props}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case "star":
      return (
        <svg
          {...props}
          fill="currentColor"
          stroke="none"
          viewBox="0 0 20 20"
          width={size}
          height={size}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...props}>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      );
    case "lock":
      return (
        <svg {...props}>
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "play":
      return (
        <svg {...props}>
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "phone":
      return (
        <svg {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "map-pin":
      return (
        <svg {...props}>
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

/* ───────────────────────── hooks ───────────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* ───────────────────────── sub-components ───────────────────────── */

function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/60"
          : "bg-transparent"
      }`}
    >
      <div className="landing-container flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
            <img src="/logo.png" alt="MindCare logo" className="w-full h-full object-cover scale-[2]" />
          </div>
          <span className="text-xl font-bold text-stone-800 tracking-tight">
            Therapist<span className="text-teal-700">AI</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNav(e, href)}
              className="px-3.5 py-2 text-sm font-medium text-stone-600 hover:text-teal-700 rounded-lg hover:bg-teal-50/60 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#pricing"
          onClick={(e) => handleNav(e, "#pricing")}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 hover:-translate-y-0.5 transition-all duration-200"
        >
          Dùng thử miễn phí
        </a>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-stone-600 hover:text-stone-900"
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
        >
          <Icon name={mobileOpen ? "x" : "menu"} size={24} />
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-200/60 shadow-xl">
          <nav className="landing-container py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNav(e, href)}
                className="px-4 py-3 text-base font-medium text-stone-700 hover:text-teal-700 rounded-lg hover:bg-teal-50/60 transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={(e) => handleNav(e, "#pricing")}
              className="mt-2 mx-4 text-center px-5 py-3 text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-md"
            >
              Dùng thử miễn phí
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function HeroComparisonSlider() {
  const [sliderPos, setSliderPos] = useState(75); // start showing mostly "before"
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gradual highlight: 0 = no highlight, 1 = full highlight
  const beforeIntensity = Math.min(1, Math.max(0, (sliderPos - 50) / 50));
  const afterIntensity = Math.min(1, Math.max(0, (50 - sliderPos) / 50));

  // Auto-animate slider with pause at edges
  useEffect(() => {
    if (!isAutoPlaying) return;
    let raf: number;
    let start: number | null = null;
    const sweepDuration = 2500;
    const pauseDuration = 2500; // longer pause at edges
    const cycleDuration = sweepDuration + pauseDuration;
    const fullCycle = cycleDuration * 2;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) % fullCycle;

      let pos: number;
      if (elapsed < sweepDuration) {
        // Sweeping from 100 to 0 (revealing "after")
        const p = elapsed / sweepDuration;
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        pos = 100 - eased * 100;
      } else if (elapsed < cycleDuration) {
        // Pausing at 0 (fully showing "after")
        pos = 0;
      } else if (elapsed < cycleDuration + sweepDuration) {
        // Sweeping from 0 to 100 (revealing "before")
        const p = (elapsed - cycleDuration) / sweepDuration;
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        pos = eased * 100;
      } else {
        // Pausing at 100 (fully showing "before")
        pos = 100;
      }

      setSliderPos(pos);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isAutoPlaying]);

  // Resume auto after 5s of no interaction
  useEffect(() => {
    if (!userInteracted) return;
    const timer = setTimeout(() => {
      setIsAutoPlaying(true);
      setUserInteracted(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [userInteracted]);

  const handleInteractionStart = () => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    setUserInteracted(true);
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
  };

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative bg-white rounded-2xl shadow-2xl shadow-stone-900/10 border border-stone-200/60 overflow-hidden select-none"
        style={{ minHeight: 340 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleInteractionEnd}
      >
        {/* ── AFTER layer (underneath) ── */}
        <div className="absolute inset-0">
          <div className="p-5 md:p-6 h-full flex flex-col">
            {/* After label - inside mockup */}
            <div className="flex items-center justify-end mb-4">
              <div
                className="flex items-center gap-2 origin-right"
                style={{
                  transform: `scale(${1 + afterIntensity * 0.2})`,
                  filter: `drop-shadow(0 0 ${afterIntensity * 10}px rgba(20, 184, 166, ${afterIntensity * 0.4}))`,
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: `rgb(${Math.round(68 - afterIntensity * 34)}, ${Math.round(68 + afterIntensity * 100)}, ${Math.round(68 + afterIntensity * 98)})` }}
                >TherapistAI</span>
                <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0">
                  <img src="/logo.png" alt="logo" className="w-full h-full object-cover scale-[2]" />
                </div>
              </div>
            </div>

            {/* AI Session Notes */}
            <div className="bg-teal-50/60 rounded-xl p-3 mb-3 border border-teal-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon name="sparkles" size={10} className="text-teal-600" />
                <span className="text-[10px] font-semibold text-teal-700">AI Session Notes</span>
                <div className="ml-auto px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[7px] font-semibold rounded-full">Hoàn tất 30s</div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-teal-200/50 rounded w-full" />
                <div className="h-1.5 bg-teal-200/50 rounded w-[85%]" />
                <div className="h-1.5 bg-teal-200/50 rounded w-[70%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Progress Tracking */}
              <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[9px] text-stone-500">PHQ-9 Trend</div>
                  <div className="px-1.5 py-0.5 bg-teal-50 text-teal-600 text-[6px] font-semibold rounded-full">Progress Tracking</div>
                </div>
                <div className="flex items-end gap-0.5 h-8">
                  {[18, 15, 12, 9].map((v, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${(v / 20) * 100}%`, background: v > 14 ? "#ef4444" : v > 9 ? "#f59e0b" : "#10b981" }} />
                  ))}
                </div>
              </div>
              {/* AI Treatment Suggestions */}
              <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[9px] text-stone-500">Gợi ý AI</div>
                  <div className="px-1.5 py-0.5 bg-teal-50 text-teal-600 text-[6px] font-semibold rounded-full">AI Suggestions</div>
                </div>
                <div className="text-[10px] font-semibold text-stone-700">CBT — Tái cấu trúc</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-1 flex-1 bg-stone-200 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} /></div>
                  <span className="text-[8px] text-emerald-600">92%</span>
                </div>
              </div>
            </div>

            {/* Smart Schedule */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[9px] font-semibold text-stone-500">Lịch hẹn</div>
                <div className="px-1.5 py-0.5 bg-teal-50 text-teal-600 text-[6px] font-semibold rounded-full">Smart Schedule</div>
              </div>
              <div className="space-y-1">
                {[
                  { time: "09:00", name: "Nguyễn V. A", tag: "Follow-up", cls: "bg-teal-100 text-teal-700" },
                  { time: "10:30", name: "Trần T. B", tag: "Initial", cls: "bg-blue-100 text-blue-700" },
                ].map((s) => (
                  <div key={s.time} className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-stone-100">
                    <span className="text-[9px] font-mono text-stone-400 w-7">{s.time}</span>
                    <span className="text-[10px] font-medium text-stone-700 flex-1">{s.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${s.cls}`}>{s.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-3 flex items-center gap-2 text-[10px] text-teal-600">
              <Icon name="check" size={12} />
              <span>1 nền tảng &middot; AI hỗ trợ &middot; Tiết kiệm 2h mỗi ngày</span>
            </div>
          </div>
        </div>

        {/* ── BEFORE layer (on top, clipped by slider) ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="bg-stone-50 border-r border-stone-200" style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100vw", minHeight: 340 }}>
            <div className="p-5 md:p-6 h-full flex flex-col" style={{ minHeight: 340 }}>
              {/* Before label - inside mockup */}
              <div className="mb-4">
                <div
                  className="text-[10px] font-semibold uppercase tracking-widest origin-left"
                  style={{
                    transform: `scale(${1 + beforeIntensity * 0.2})`,
                    color: `rgb(${Math.round(168 + beforeIntensity * 71)}, ${Math.round(162 - beforeIntensity * 94)}, ${Math.round(158 - beforeIntensity * 90)})`,
                    textShadow: beforeIntensity > 0.3 ? `0 0 ${beforeIntensity * 12}px rgba(239, 68, 68, ${beforeIntensity * 0.3})` : "none",
                  }}
                >Quy trình hiện tại</div>
              </div>

              <div className="flex-1 relative" style={{ minHeight: 180 }}>
                <div className="absolute top-0 left-0 w-[55%] bg-white rounded-lg border border-stone-200 shadow-md p-2.5 rotate-[-2deg] z-10">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-[7px] text-white font-bold">D</div>
                    <span className="text-[9px] text-stone-500">session_note_v3.docx</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 bg-stone-100 rounded w-full" />
                    <div className="h-1.5 bg-stone-100 rounded w-[80%]" />
                    <div className="h-1.5 bg-stone-100 rounded w-[60%]" />
                  </div>
                </div>

                <div className="absolute top-8 right-0 w-[50%] bg-white rounded-lg border border-stone-200 shadow-md p-2.5 rotate-[3deg] z-20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-4 h-4 rounded bg-emerald-600 flex items-center justify-center text-[7px] text-white font-bold">X</div>
                    <span className="text-[9px] text-stone-500">PHQ9_tracking.xlsx</span>
                  </div>
                  <div className="grid grid-cols-4 gap-0.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-2.5 bg-stone-50 border border-stone-200 rounded-sm text-[5px] text-stone-300 flex items-center justify-center">{i < 4 ? ["T1", "T2", "T3", "T4"][i] : ""}</div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-8 left-[10%] w-[45%] bg-stone-800 rounded-lg shadow-md p-2.5 rotate-[1deg] z-30">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-4 h-4 rounded bg-blue-400 flex items-center justify-center text-[7px] text-white font-bold">Z</div>
                    <span className="text-[9px] text-stone-400">Zoom Meeting</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1 h-8 bg-stone-700 rounded" />
                    <div className="w-6 h-8 bg-stone-600 rounded" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-[5%] w-[40%] bg-white rounded-lg border border-stone-200 shadow-md p-2.5 rotate-[-1deg] z-20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-4 h-4 rounded bg-red-500 flex items-center justify-center text-[7px] text-white font-bold">C</div>
                    <span className="text-[9px] text-stone-500">Google Calendar</span>
                  </div>
                  <div className="space-y-0.5">
                    {["09:00 - Nguyễn V.A", "10:30 - Trần T.B"].map((t) => (
                      <div key={t} className="text-[7px] text-stone-500 bg-blue-50 px-1.5 py-0.5 rounded">{t}</div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-[40%] left-[40%] z-40">
                  <div className="bg-red-50 border border-red-200 rounded-full px-2 py-0.5 text-[8px] text-red-500 font-medium animate-pulse">
                    Alt+Tab...
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[10px] text-red-500">
                <Icon name="clock" size={12} />
                <span>4+ công cụ &middot; Copy-paste liên tục &middot; Dữ liệu phân tán</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Slider handle ── */}
        <div
          className="absolute top-0 bottom-0 z-50 flex items-center cursor-ew-resize"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)", width: 24 }}
          onMouseDown={handleInteractionStart}
          onTouchStart={handleInteractionStart}
        >
          {/* Vertical line */}
          <div className="absolute inset-y-0 w-[2px] bg-white/90 left-1/2 -translate-x-1/2 shadow-sm" />
          {/* Small handle circle */}
          <div className={`relative w-5 h-5 rounded-full bg-white border border-stone-300 shadow-md flex items-center justify-center cursor-ew-resize transition-all ${isDragging ? "scale-110 shadow-lg border-teal-400" : "hover:scale-110 hover:border-teal-400"}`}>
            <div className="flex gap-[2px]">
              <div className="w-[1.5px] h-2 bg-stone-300 rounded-full" />
              <div className="w-[1.5px] h-2 bg-stone-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureMockup({ type }: { type: string }) {
  const mockups: Record<string, React.ReactNode> = {
    "session-notes": (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
            SOAP Note
          </div>
          <div className="px-3 py-1 bg-stone-100 text-stone-500 text-xs rounded-full">
            DAP
          </div>
          <div className="px-3 py-1 bg-stone-100 text-stone-500 text-xs rounded-full">
            Free-form
          </div>
        </div>
        <div className="space-y-2.5">
          <div>
            <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
              Subjective
            </div>
            <div className="bg-white/80 rounded-lg p-2.5 text-xs text-stone-600 leading-relaxed border border-stone-200/60">
              Thân chủ báo cáo cải thiện giấc ngủ trong tuần qua, ngủ được
              6-7 tiếng/đêm so với 4 tiếng trước đó...
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
              Objective
            </div>
            <div className="bg-white/80 rounded-lg p-2.5 text-xs text-stone-600 leading-relaxed border border-stone-200/60">
              Biểu cảm phù hợp, giao tiếp mắt tốt. PHQ-9: 12 (giảm từ 18).
              Trang phục gọn gàng...
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
              <Icon name="sparkles" size={12} />
              AI đã tạo bản nháp
            </div>
            <div className="text-stone-300">|</div>
            <div className="text-stone-400 text-[11px]">
              Chỉnh sửa để hoàn tất
            </div>
          </div>
        </div>
      </div>
    ),
    "progress-dashboard": (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-stone-700">
            PHQ-9 Progress
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            -38% so với baseline
          </div>
        </div>
        {/* mini chart mockup */}
        <div className="h-24 flex items-end gap-1.5 px-1">
          {[18, 16, 15, 14, 12, 11, 9].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${(v / 20) * 100}%`,
                  background:
                    v > 14
                      ? "#ef4444"
                      : v > 9
                      ? "#f59e0b"
                      : "#10b981",
                }}
              />
              <span className="text-[9px] text-stone-400">T{i + 1}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] text-stone-500">Nặng</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] text-stone-500">Trung bình</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-stone-500">Nhẹ</span>
          </div>
        </div>
      </div>
    ),
    "treatment-suggestions": (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="sparkles" size={14} className="text-teal-600" />
          <span className="text-xs font-semibold text-stone-700">
            Gợi ý can thiệp
          </span>
        </div>
        {[
          {
            label: "CBT — Tái cấu trúc nhận thức",
            conf: "92%",
            tag: "Khuyên dùng",
          },
          {
            label: "Behavioral Activation",
            conf: "87%",
            tag: "Phù hợp",
          },
          {
            label: "Mindfulness-based",
            conf: "78%",
            tag: "Tham khảo",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2.5 bg-white/80 rounded-lg border border-stone-200/60"
          >
            <div>
              <div className="text-xs font-medium text-stone-700">
                {s.label}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">
                Confidence: {s.conf}
              </div>
            </div>
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                i === 0
                  ? "bg-emerald-100 text-emerald-700"
                  : i === 1
                  ? "bg-blue-100 text-blue-700"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {s.tag}
            </div>
          </div>
        ))}
        <div className="text-[10px] text-stone-400 italic pt-1">
          Dựa trên DSM-5 & clinical guidelines. Tham khảo, không thay thế
          quyết định lâm sàng.
        </div>
      </div>
    ),
    "smart-scheduling": (
      <div className="space-y-2">
        <div className="text-xs font-semibold text-stone-700 mb-3">
          Thứ Hai, 17/02
        </div>
        {[
          {
            time: "09:00",
            name: "Nguyễn Văn A",
            type: "Follow-up",
            color: "bg-teal-500",
          },
          {
            time: "10:30",
            name: "Trần Thị B",
            type: "Initial",
            color: "bg-blue-500",
          },
          {
            time: "14:00",
            name: "Lê Văn C",
            type: "Crisis",
            color: "bg-red-500",
          },
          {
            time: "15:30",
            name: "Phạm Thị D",
            type: "Assessment",
            color: "bg-purple-500",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 bg-white/80 rounded-lg border border-stone-200/60"
          >
            <div className="text-[11px] text-stone-400 font-mono w-10">
              {s.time}
            </div>
            <div className={`w-1 h-8 rounded-full ${s.color}`} />
            <div className="flex-1">
              <div className="text-xs font-medium text-stone-700">
                {s.name}
              </div>
              <div className="text-[10px] text-stone-400">{s.type}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    telehealth: (
      <div className="space-y-3">
        {/* mock video */}
        <div className="relative bg-stone-800 rounded-xl h-32 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-700 to-stone-900" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-stone-600 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">TC</span>
            </div>
            <span className="text-stone-400 text-[11px]">
              Đang kết nối...
            </span>
          </div>
          {/* PiP */}
          <div className="absolute bottom-2 right-2 w-16 h-12 rounded-lg bg-stone-600 border-2 border-stone-500 flex items-center justify-center">
            <span className="text-stone-300 text-[9px]">Bạn</span>
          </div>
          {/* Recording badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/90 px-2 py-0.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white text-[9px] font-medium">REC</span>
          </div>
        </div>
        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {["Mic", "Camera", "Share", "Record"].map((l) => (
            <div
              key={l}
              className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center"
            >
              <span className="text-[9px] text-stone-500">{l}</span>
            </div>
          ))}
          <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-[9px] text-white font-semibold">End</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-600">
          <Icon name="lock" size={10} />
          Mã hóa đầu-cuối
        </div>
      </div>
    ),
  };
  return (
    <div className="bg-stone-50/80 rounded-2xl border border-stone-200/70 p-5 shadow-inner">
      {mockups[type] ?? null}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200/70 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="text-base md:text-lg font-medium text-stone-800 group-hover:text-teal-700 transition-colors">
          {q}
        </span>
        <span
          className={`shrink-0 text-stone-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <Icon name="chevron-down" size={20} />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-60 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-stone-600 leading-relaxed pr-8">{a}</p>
      </div>
    </div>
  );
}

/* ───────────────────────── section wrapper ───────────────────────── */

function Section({
  id,
  className = "",
  children,
  bg = "white",
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  bg?: "white" | "warm" | "teal";
}) {
  const { ref, isVisible } = useInView(0.1);
  const bgMap = {
    white: "bg-white",
    warm: "bg-[#FAF8F5]",
    teal: "bg-gradient-to-br from-teal-700 to-teal-900 text-white",
  };
  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className={`${bgMap[bg]} ${className}`}
    >
      <div
        className={`landing-container py-16 md:py-24 transition-all duration-700 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

/* ───────────────────────── main page ───────────────────────── */

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Cảm ơn ${formData.name}! Chúng tôi sẽ liên hệ bạn qua ${formData.email} trong 24 giờ.`
    );
    setFormData({ name: "", email: "", phone: "" });
  };

  return (
    <div className="landing-page">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "TherapistAI",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web",
            description:
              "Nền tảng AI hỗ trợ chuyên gia tâm lý tiết kiệm thời gian ghi chú, theo dõi tiến trình thân chủ, và nâng cao chất lượng trị liệu.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "VND",
              description: "Dùng thử miễn phí 14 ngày",
            },
          }),
        }}
      />

      <StickyHeader />

      {/* ════════════════ S1: HERO ════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-white to-teal-50/40 pt-28 md:pt-36 pb-16 md:pb-24">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #0d9488 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div className="landing-container relative">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Copy */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200/60 rounded-full mb-6">
                <Icon name="shield" size={14} className="text-teal-600" />
                <span className="text-xs font-medium text-teal-700">
                  Bảo mật dữ liệu chuẩn quốc tế
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-stone-900 leading-[1.12] tracking-tight">
                Bớt ghi chép.
                <br />
                <span className="text-teal-700">Thêm trị liệu.</span>
              </h1>

              <p className="mt-5 text-lg md:text-xl text-stone-600 leading-relaxed max-w-lg">
                TherapistAI tự động hóa ghi chú phiên trị liệu, theo dõi tiến
                trình thân chủ, và hỗ trợ ra quyết định lâm sàng — để bạn
                tập trung vào điều quan trọng nhất.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#pricing")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Dùng thử miễn phí 14 ngày
                  <Icon name="arrow-right" size={18} />
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:border-stone-300 hover:bg-stone-50 transition-all duration-200"
                >
                  <Icon name="play" size={16} />
                  Xem cách hoạt động
                </a>
              </div>

              <p className="mt-4 text-sm text-stone-400">
                Không cần thẻ tín dụng &middot; Setup trong 2 phút &middot;
                Hủy bất cứ lúc nào
              </p>
            </div>

            {/* Hero mockup - Comparison Slider */}
            <HeroComparisonSlider />
          </div>
        </div>
      </section>


      {/* ════════════════ S3: PAIN POINTS ════════════════ */}
      <Section bg="warm">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Bạn có đang gặp những vấn đề này?
          </h2>
          <p className="mt-3 text-lg text-stone-500 max-w-2xl mx-auto">
            Hầu hết chuyên gia tâm lý phải dành 30-40% thời gian cho công việc
            hành chính chứ không phải trị liệu.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {PAIN_POINTS.map((p, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl p-6 md:p-7 border border-stone-200/70 shadow-sm hover:shadow-md hover:border-stone-300/70 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                <Icon name={p.icon} size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-2">
                {p.title}
              </h3>
              <p className="text-stone-500 leading-relaxed text-sm md:text-base">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════ S4: SOLUTION OVERVIEW ════════════════ */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200/60 rounded-full mb-6">
            <Icon name="sparkles" size={16} className="text-teal-600" />
            <span className="text-sm font-medium text-teal-700">
              Giải pháp toàn diện
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            TherapistAI — Trợ lý AI
            <br className="hidden md:block" /> được thiết kế riêng cho bạn
          </h2>

          <p className="mt-5 text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Một nền tảng duy nhất thay thế hàng chục công cụ rời rạc. Từ ghi
            chú phiên trị liệu, theo dõi tiến trình, quản lý lịch hẹn, đến
            video call bảo mật — tất cả được hỗ trợ bởi AI hiểu ngữ cảnh tâm
            lý lâm sàng tiếng Việt.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-stone-500">
            {[
              "Tiết kiệm 2+ giờ mỗi ngày",
              "Không cần cài đặt",
              "Hỗ trợ tiếng Việt đầy đủ",
              "Setup trong 2 phút",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <Icon name="check" size={16} className="text-teal-600" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════ S5: KEY FEATURES ════════════════ */}
      <Section id="features" bg="warm">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Mọi thứ bạn cần, trong một nơi
          </h2>
          <p className="mt-3 text-lg text-stone-500 max-w-2xl mx-auto">
            5 tính năng cốt lõi giúp bạn làm việc hiệu quả hơn mỗi ngày.
          </p>
        </div>

        <div className="space-y-12 md:space-y-20">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200/50 rounded-full mb-4">
                  <Icon name="sparkles" size={12} className="text-teal-600" />
                  <span className="text-xs font-semibold text-teal-700">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-2xl md:text-[28px] font-bold text-stone-800 mb-3">
                  {f.title}
                </h3>
                <p className="text-stone-600 leading-relaxed text-base md:text-[17px]">
                  {f.desc}
                </p>
              </div>
              <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                <FeatureMockup type={f.mockup} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════ S6: HOW IT WORKS ════════════════ */}
      <Section id="how-it-works">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Bắt đầu chỉ trong 4 bước
          </h2>
          <p className="mt-3 text-lg text-stone-500 max-w-2xl mx-auto">
            Không phức tạp. Không mất thời gian setup. Đăng ký và bắt đầu ngay.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5">
          {STEPS.map((s, i) => (
            <div key={i} className="relative group">
              {/* Connector line for desktop */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-stone-200 z-0" />
              )}
              <div className="relative bg-white rounded-2xl p-6 border border-stone-200/70 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {s.num}
                  </div>
                  <Icon
                    name={s.icon}
                    size={20}
                    className="text-stone-400 group-hover:text-teal-600 transition-colors"
                  />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#pricing")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Bắt đầu ngay — Miễn phí
            <Icon name="arrow-right" size={18} />
          </a>
        </div>
      </Section>


      {/* ════════════════ S8: PRICING / CTA ════════════════ */}
      <Section id="pricing">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Chọn gói phù hợp với bạn
          </h2>
          <p className="mt-3 text-lg text-stone-500 max-w-2xl mx-auto">
            Bắt đầu miễn phí, nâng cấp khi bạn sẵn sàng. Không cam kết dài
            hạn.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {PLANS.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 md:p-7 border transition-all duration-300 hover:-translate-y-1 ${
                p.highlighted
                  ? "bg-white border-teal-300 shadow-xl shadow-teal-600/10 ring-1 ring-teal-200"
                  : "bg-white border-stone-200/70 shadow-sm hover:shadow-md"
              }`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full text-xs font-semibold text-white shadow-md">
                  Phổ biến nhất
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-lg font-bold text-stone-800">{p.name}</h3>
                <p className="text-sm text-stone-500 mt-1">{p.desc}</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-stone-900">
                  {p.price}
                </span>
                <span className="text-stone-500 text-sm ml-1">{p.period}</span>
              </div>
              <ul className="space-y-3 mb-7">
                {p.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-sm text-stone-600"
                  >
                    <Icon
                      name="check"
                      size={16}
                      className="text-teal-600 shrink-0 mt-0.5"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  p.highlighted
                    ? "text-white bg-gradient-to-r from-teal-600 to-teal-700 shadow-md shadow-teal-600/20 hover:shadow-lg hover:-translate-y-0.5"
                    : "text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/60"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Lead capture form */}
        <div className="max-w-xl mx-auto bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-7 md:p-10 text-white shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold">
              Bắt đầu dùng thử miễn phí
            </h3>
            <p className="mt-2 text-teal-100 text-sm">
              Không cần thẻ tín dụng &middot; Setup trong 2 phút &middot; Hủy
              bất cứ lúc nào
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Họ và tên"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((d) => ({ ...d, name: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-teal-200/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((d) => ({ ...d, email: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-teal-200/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={(e) =>
                setFormData((d) => ({ ...d, phone: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-teal-200/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-white text-teal-800 font-bold rounded-xl shadow-lg hover:bg-teal-50 hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              Dùng thử miễn phí 14 ngày
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-teal-200/80 text-xs">
            <Icon name="lock" size={12} />
            Thông tin của bạn được bảo mật tuyệt đối
          </div>
        </div>
      </Section>

      {/* ════════════════ S9: FAQ ════════════════ */}
      <Section id="faq" bg="warm">
        <div className="text-center mb-12 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-3 text-lg text-stone-500">
            Chưa tìm thấy câu trả lời?{" "}
            <a
              href="mailto:support@therapist.ai"
              className="text-teal-700 font-medium underline underline-offset-2 hover:text-teal-800"
            >
              Liên hệ chúng tôi
            </a>
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-stone-200/70 shadow-sm divide-y-0 px-6 md:px-8">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </Section>

      {/* ════════════════ S10: FINAL CTA + FOOTER ════════════════ */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 text-white">
        <div className="landing-container py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            Sẵn sàng dành thêm thời gian
            <br className="hidden md:block" /> cho thân chủ của bạn?
          </h2>
          <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
            TherapistAI giúp bạn tiết kiệm thời gian và nâng cao chất lượng
            trị liệu mỗi ngày.
          </p>
          <div className="mt-8">
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#pricing")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-teal-800 bg-white rounded-xl shadow-xl hover:bg-teal-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Dùng thử miễn phí 14 ngày
              <Icon name="arrow-right" size={20} />
            </a>
          </div>
          <p className="mt-4 text-sm text-teal-200/80">
            Không cần thẻ tín dụng &middot; Setup trong 2 phút
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400">
        <div className="landing-container py-12 md:py-16">
          <div className="grid md:grid-cols-4 gap-10 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                  <img src="/logo.png" alt="MindCare logo" className="w-full h-full object-cover scale-[2]" />
                </div>
                <span className="text-lg font-bold text-white">
                  Therapist<span className="text-teal-400">AI</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Nền tảng AI hỗ trợ chuyên gia tâm lý làm việc hiệu quả hơn,
                an toàn hơn.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Sản phẩm
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Tính năng
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Bảng giá
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Pháp lý
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Chính sách cookie
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bảo mật dữ liệu
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Liên hệ
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <Icon name="mail" size={14} />
                  support@therapist.ai
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="phone" size={14} />
                  1900 xxxx
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="map-pin" size={14} className="shrink-0 mt-0.5" />
                  <span>
                    Tầng 10, Tòa nhà ABC,
                    <br />
                    Quận 1, TP. Hồ Chí Minh
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-500">
              &copy; {new Date().getFullYear()} TherapistAI. All rights
              reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Icon name="lock" size={12} />
              Dữ liệu được mã hóa AES-256 &middot; Tuân thủ tiêu chuẩn quốc tế
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
