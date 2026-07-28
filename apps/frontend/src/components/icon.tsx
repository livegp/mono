interface IconProps {
  className?: string;
  name: "react" | "ts" | "vite";
  title: string;
}

export function Icon({ className, name, title }: IconProps) {
  return (
    <svg aria-label={title} className={className} role="img">
      <use href={`/__spritemap#icon-${name}`} />
    </svg>
  );
}
