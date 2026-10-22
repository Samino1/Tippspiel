// Ein Eingabefeld für die Tore eines Teams.
// pattern beschreibt die erlaubte Eingabe direkt im HTML (0–99); die genaue Prüfung macht validateTipInput.
export default function GoalInput({ value, onChange, disabled, label, invalid }) {
  return (
    <input
      className={invalid ? 'goal-input goal-input--invalid' : 'goal-input'}
      type="text"
      inputMode="numeric"
      maxLength={2}
      pattern="[0-9]{1,2}"
      value={value}
      disabled={disabled}
      aria-label={label}
      aria-invalid={invalid}
      onChange={(event) => onChange(event.target.value.trim())}
    />
  );
}
