import "./Spinner.sass";

export interface SpinnerProps {}

export default function Spinner() {
  return (
    <div class="spinner-container">
      <svg class="spinner">
        <circle cx="20" cy="20" r="18" />
      </svg>
    </div>
  );
}
