import { Plus, Trash2 } from "lucide-react";
import { Input } from "./Input";
import { Select } from "./Select";

export type Contact = {
  id: string;
  type: string;
  value: string;
};

const CONTACT_TYPES = [
  { id: "phone", label: "Teléfono" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "github", label: "GitHub" },
  { id: "twitter", label: "Twitter" },
  { id: "website", label: "Sitio Web" },
  { id: "other", label: "Otro" },
];

const CONTACT_RULES: Record<
  string,
  { regex: RegExp; error: string; max?: number; placeholder: string }
> = {
  phone: {
    regex: /^\+?[0-9]{7,15}$/,
    error: "Teléfono inválido",
    max: 1,
    placeholder: "+506 88888888",
  },
  whatsapp: {
    regex: /^\+?[0-9]{7,15}$/,
    error: "WhatsApp inválido",
    max: 1,
    placeholder: "+506 77777777",
  },
  linkedin: {
    regex: /^https:\/\/(www\.)?linkedin\.com\/.+$/,
    error: "URL de LinkedIn inválida",
    max: 1,
    placeholder: "https://linkedin.com/in/tu-usuario",
  },
  github: {
    regex: /^https:\/\/(www\.)?github\.com\/.+$/,
    error: "URL de GitHub inválida",
    max: 1,
    placeholder: "https://github.com/tu-usuario",
  },
  website: {
    regex: /^https?:\/\/.+$/,
    error: "URL inválida",
    max: 1,
    placeholder: "https://tu-sitio.com",
  },
  twitter: {
    regex: /^https:\/\/(www\.)?(twitter|x)\.com\/.+$/,
    error: "URL de Twitter/X inválida",
    max: 1,
    placeholder: "https://x.com/usuario",
  },
  other: {
    regex: /^.+$/,
    error: "Valor inválido",
    max: 1,
    placeholder: "Escribe aquí tu contacto...",
  },
};

export function DynamicContactList({
  contacts,
  onChange,
  label = "Contacts",
}: {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
  label?: string;
}) {
  const addContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      type: "",
      value: "",
    };
    onChange([...contacts, newContact]);
  };

  const removeContact = (id: string) => {
    onChange(contacts.filter((contact) => contact.id !== id));
  };

  const updateContact = (
    id: string,
    field: "type" | "value",
    newValue: string,
  ) => {
    onChange(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: newValue } : contact,
      ),
    );
  };

  const validateContact = (contact: Contact) => {
    if (!contact.type || !contact.value) return null;
    const rule = CONTACT_RULES[contact.type];
    if (!rule) return null;
    return rule.regex.test(contact.value) ? null : rule.error;
  };

  const canUseType = (type: string, currentId?: string) => {
    const rule = CONTACT_RULES[type];
    if (!rule?.max) return true;

    const count = contacts.filter(
      (c) => c.type === type && c.id !== currentId,
    ).length;

    return count < rule.max;
  };

  const contactTypeOptions = CONTACT_TYPES.map((t) => ({
    ...t,
    disableOption: !canUseType(t.id),
  }));

  return (
    <div className="flex flex-col gap-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <button
          type="button"
          onClick={addContact}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border/60 rounded-lg">
            No contacts have been added. Click "Add Contact" to begin.
          </p>
        ) : (
          contacts.map((contact) => {
            const error = validateContact(contact);
            return (
              <div key={contact.id} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Select
                    name={`contact-type-${contact.id}`}
                    value={contact.type}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!canUseType(value, contact.id)) return;
                      updateContact(contact.id, "type", value);
                    }}
                    options={contactTypeOptions}
                    placeholder="Type of contact"
                  />
                  <Input
                    name={`contact-value-${contact.id}`}
                    value={contact.value}
                    onChange={(e) =>
                      updateContact(contact.id, "value", e.target.value)
                    }
                    placeholder={
                      CONTACT_RULES[contact.type]?.placeholder || "add contact"
                    }
                    disabled={!contact.type}
                    error={error || undefined}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeContact(contact.id)}
                  className="mt-2 p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete contact"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
