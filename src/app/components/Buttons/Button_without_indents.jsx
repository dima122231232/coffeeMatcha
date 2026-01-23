export default function Button_wth_ind({
  children,
  className = "",
  type = "button",
  withArrow = true,
}) {
  return (
    <button
      type={type}
      className={`bt-style ${className}`.trim()}
    >
      {children}

      {withArrow && (
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.7071 8.07137C21.0976 7.68084 21.0976 7.04768 20.7071 6.65715L14.3431 0.293191C13.9526 -0.0973332 13.3195 -0.0973332 12.9289 0.293191C12.5384 0.683715 12.5384 1.31688 12.9289 1.7074L18.5858 7.36426L12.9289 13.0211C12.5384 13.4116 12.5384 14.0448 12.9289 14.4353C13.3195 14.8259 13.9526 14.8259 14.3431 14.4353L20.7071 8.07137ZM0 7.36426L0 8.36426L20 8.36426L20 7.36426L20 6.36426L0 6.36426L0 7.36426Z"
            fill="#345D31"
          />
        </svg>
      )}
    </button>
  );
}
