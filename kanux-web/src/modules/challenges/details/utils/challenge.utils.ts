export function formatDuration(minutes?: number) {
  if (!minutes) return "No especificado";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ""}`;
  return `${minutes}m`;
}

interface StartButtonProps {
  href: string;
  disabled: boolean;
  label: string;
}

export function getStartButtonProps(
  isTechnical: boolean,
  startUrl: string,
): StartButtonProps {
  if (isTechnical) {
    return {
      href: startUrl,
      disabled: false,
      label: "Iniciar challenge",
    };
  }

  return {
    href: "#",
    disabled: true,
    label: "Disponible pronto",
  };
}
