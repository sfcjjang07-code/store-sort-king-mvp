type Variant = 'solid' | 'accent' | 'ghost' | 'danger';

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function PrimaryButton({
  variant = 'solid',
  className = '',
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`primary-button primary-button--${variant} ${className}`.trim()}
      {...props}
    />
  );
}
