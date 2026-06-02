type VegetarianIndicatorProps = {
  className?: string;
};

/** Indian veg mark — green square with green dot. */
export function VegetarianIndicator({
  className,
}: Readonly<VegetarianIndicatorProps>) {
  return (
    <span
      className={className}
      aria-label="Vegetarian"
      title="Vegetarian"
      role="img"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect
          x="0.75"
          y="0.75"
          width="12.5"
          height="12.5"
          rx="1.5"
          stroke="#22A447"
          strokeWidth="1.5"
        />
        <circle cx="7" cy="7" r="3" fill="#22A447" />
      </svg>
    </span>
  );
}
