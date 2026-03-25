import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Wie funktioniert die Padel Liga?',
    answer:
      'Du erstellst eine Liga, lädst Teams per Einladungslink ein und der Spielplan wird automatisch generiert. Ergebnisse können direkt in der App eingetragen werden – die Tabelle aktualisiert sich in Echtzeit.',
  },
  {
    question: 'Ist die Nutzung kostenlos?',
    answer:
      'Ja, die Padel Liga App ist aktuell komplett kostenlos nutzbar. Es gibt keine versteckten Kosten oder Premium-Features.',
  },
  {
    question: 'Wie viele Teams können mitmachen?',
    answer:
      'Eine Liga kann beliebig viele Teams aufnehmen. Bei großen Ligen empfehlen wir die Gruppenphase mit anschließenden Playoffs.',
  },
  {
    question: 'Kann ich mehrere Ligen gleichzeitig verwalten?',
    answer:
      'Ja, du kannst beliebig viele Ligen erstellen oder ihnen beitreten. Jede Liga hat ihren eigenen Spielplan, Tabelle und Platzbuchungen.',
  },
  {
    question: 'Wie funktioniert die Platzbuchung?',
    answer:
      'Liga-Admins können Venues und Courts anlegen und Zeitslots freigeben. Teams buchen dann selbstständig passende Slots für ihre Matches.',
  },
  {
    question: 'Brauche ich eine App oder reicht der Browser?',
    answer:
      'Die Padel Liga läuft komplett im Browser – auf dem Handy, Tablet oder Desktop. Keine Installation nötig.',
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Häufige Fragen
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Alles was du über die Padel Liga wissen musst.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
