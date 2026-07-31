interface IconProps {
  className?: string;
  name: "react" | "ts" | "vite";
  title: string;
}

export const Icon = ({ className, name, title }: IconProps) => (
  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- An inline SVG icon needs image semantics.
  <svg aria-label={title} className={className} role="img">
    <use href={`/__spritemap#icon-${name}`} />
  </svg>
);
