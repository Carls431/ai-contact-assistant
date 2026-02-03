const { useState } = React;

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [summary, setSummary] = useState("Waiting for a message.");
  const [reply, setReply] = useState("Send a message to generate a reply.");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("Friendly");
  const [isDark, setIsDark] = useState(false);

  const templates = {
    Friendly: "Thanks for reaching out! I can help with that. Here are the next steps...",
    Direct: "Thanks for your message. Here is the information you requested.",
    Sales: "Great timing! I'd love to walk you through our packages and pricing.",
  };

  const inboxPreview = [
    {
      name: "Marie Santos",
      topic: "Pricing & onboarding",
      time: "5m ago",
    },
    {
      name: "Jared Lim",
      topic: "Enterprise support",
      time: "23m ago",
    },
    {
      name: "Carmen Lee",
      topic: "Partnership inquiry",
      time: "1h ago",
    },
  ];

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus("Working on your response...");
    setSummary("Generating summary...");
    setReply("Generating reply...");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSummary(data.summary);
      setReply(data.reply);
      setStatus("Done! You can copy or edit the reply.");
      setToast("AI response ready. Copy or adjust before sending.");
    } catch (error) {
      setSummary("No summary yet.");
      setReply("No reply yet.");
      setStatus(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast("Copied to clipboard.");
    } catch (error) {
      setToast("Unable to copy. Please copy manually.");
    }
  };

  const theme = {
    page: isDark
      ? "bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100"
      : "bg-gradient-to-br from-clay-100 via-clay-50 to-clay-100 text-slate-900",
    card: isDark
      ? "border-slate-800 bg-slate-900/80 shadow-[0_18px_40px_rgba(3,7,18,0.5)]"
      : "border-clay-200 bg-white/90 shadow-[0_18px_40px_rgba(33,41,38,0.06)]",
    panel: isDark ? "border-slate-800 bg-slate-900/85" : "border-clay-200 bg-white/85",
    subPanel: isDark ? "bg-slate-800/70 text-slate-300" : "bg-clay-100/70 text-slate-600",
    mutedText: isDark ? "text-slate-400" : "text-slate-500",
    input: isDark
      ? "border-slate-700 bg-slate-900/60 text-slate-100 focus:border-emerald-300 focus:ring-emerald-500/30"
      : "border-clay-200 bg-clay-100/70 text-slate-900 focus:border-clay-600 focus:ring-clay-100",
    pill: isDark
      ? "border-slate-700 bg-slate-800 text-slate-300"
      : "border-clay-300 bg-clay-50 text-slate-700",
  };

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 md:px-8">
        <nav
          className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl border px-6 py-4 shadow-[0_18px_36px_rgba(33,41,38,0.06)] ${theme.panel}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-clay-600/90 text-white">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold">Contact Desk</p>
              <p className={`text-xs ${theme.mutedText}`}>AI-assisted inbox</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className={`rounded-full border px-3 py-1 ${theme.subPanel}`}>
              SLA: 2h response
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
              Online now
            </span>
            <button
              className={`rounded-full border px-3 py-1 ${theme.subPanel}`}
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </nav>

        <header className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-clay-600">
              AI Contact Assistant
            </p>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl">
              Turn inquiries into clear action, instantly.
            </h1>
            <p className={`mt-4 max-w-xl text-sm sm:text-base ${theme.mutedText}`}>
              Collect customer messages and let AI summarize the intent and propose a
              friendly reply. Built for busy teams who want quick clarity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium">
              {["Summaries in seconds", "Reply suggestions", "Lightweight + fast"].map(
                (item) => (
                  <span
                    key={item}
                    className={`rounded-full border px-3 py-1 shadow-sm ${theme.pill}`}
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
          <div className={`grid gap-4 rounded-3xl border p-6 ${theme.panel}`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${theme.mutedText}`}>
                Response Preview
              </p>
              <h2 className="mt-4 text-lg font-semibold">
                Summary + Reply in seconds
              </h2>
              <div className={`mt-4 grid gap-2 text-sm ${theme.mutedText}`}>
                <span>• Key points summarized</span>
                <span>• Polite reply suggestion</span>
                <span>• Ready to send or edit</span>
              </div>
            </div>
            <div className={`rounded-2xl p-4 text-xs ${theme.subPanel}`}>
              AI-assisted suggestions. Always review before sending.
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            onSubmit={handleSubmit}
            className={`rounded-3xl border p-6 ${theme.card}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Customer Message</h3>
                <p className={`mt-1 text-sm ${theme.mutedText}`}>
                  Fill in the form and let the AI assistant do the rest.
                </p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs ${theme.subPanel}`}>
                New inquiry
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              <label className={`grid gap-2 text-sm ${theme.mutedText}`}>
                Name
                <input
                  className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-4 ${theme.input}`}
                  name="name"
                  placeholder="Juan Dela Cruz"
                  value={formData.name}
                  onChange={updateField}
                  required
                />
              </label>
              <label className={`grid gap-2 text-sm ${theme.mutedText}`}>
                Email
                <input
                  className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-4 ${theme.input}`}
                  name="email"
                  type="email"
                  placeholder="juan@email.com"
                  value={formData.email}
                  onChange={updateField}
                  required
                />
              </label>
              <label className={`grid gap-2 text-sm ${theme.mutedText}`}>
                Message
                <textarea
                  className={`min-h-[120px] w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-4 ${theme.input}`}
                  name="message"
                  placeholder="Hi! I want to know more about your services..."
                  value={formData.message}
                  onChange={updateField}
                  required
                />
              </label>
            </div>

            <div className="mt-6">
              <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${theme.mutedText}`}>
                Reply tone
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.keys(templates).map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => {
                      setActiveTemplate(template);
                      setReply(templates[template]);
                      setToast(`Template applied: ${template}`);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      activeTemplate === template
                        ? "border-clay-600 bg-clay-600 text-white"
                        : isDark
                          ? "border-slate-700 bg-slate-800 text-slate-300"
                          : "border-clay-200 bg-clay-50 text-slate-600"
                    }`}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-between rounded-2xl bg-clay-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-clay-600/25 transition hover:-translate-y-0.5 hover:bg-clay-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{isLoading ? "Generating..." : "Generate Summary"}</span>
              <span className="text-xs uppercase tracking-[0.3em]">AI Ready</span>
            </button>
            {status && (
              <p
                className={`mt-4 text-xs ${
                  status.toLowerCase().includes("error") ? "text-red-600" : "text-slate-500"
                }`}
              >
                {status}
              </p>
            )}
            <p className={`mt-3 text-xs ${theme.mutedText}`}>
              AI-assisted suggestions. Please review for accuracy before sending.
            </p>
          </form>

          <div className="grid gap-4">
            <div className={`rounded-3xl border p-6 ${theme.card}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">AI Output</h3>
                  <p className={`mt-1 text-xs uppercase tracking-[0.3em] ${theme.mutedText}`}>
                    Summary
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(summary)}
                  className={`rounded-full border px-3 py-1 text-xs ${theme.subPanel}`}
                >
                  Copy summary
                </button>
              </div>
              <div className={`mt-3 rounded-2xl border p-4 text-sm whitespace-pre-wrap ${theme.subPanel}`}>
                {summary}
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <p className={`text-xs uppercase tracking-[0.3em] ${theme.mutedText}`}>
                  Reply Suggestion
                </p>
                <button
                  type="button"
                  onClick={() => copyText(reply)}
                  className={`rounded-full border px-3 py-1 text-xs ${theme.subPanel}`}
                >
                  Copy reply
                </button>
              </div>
              <div className={`mt-3 rounded-2xl border p-4 text-sm whitespace-pre-wrap ${theme.subPanel}`}>
                {reply}
              </div>
              <div className={`mt-4 rounded-2xl p-4 text-xs ${theme.subPanel}`}>
                <p className="font-semibold">Tips</p>
                <ul className="mt-2 grid gap-2">
                  <li>Review before sending for accuracy.</li>
                  <li>Customize tone to match your brand.</li>
                  <li>Use the summary for quick internal notes.</li>
                </ul>
              </div>
            </div>

            <div className={`rounded-3xl border p-6 ${theme.card}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Inbox preview</h4>
                <span className={`text-xs ${theme.mutedText}`}>Today</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                {inboxPreview.map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${theme.subPanel}`}
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className={`text-xs ${theme.mutedText}`}>{item.topic}</p>
                    </div>
                    <span className={`text-xs ${theme.mutedText}`}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 rounded-2xl border px-4 py-3 text-xs shadow-lg ${
            isDark ? "border-slate-700 bg-slate-900/90 text-slate-200" : "border-clay-200 bg-white/95 text-slate-600"
          }`}
        >
          {toast}
        </div>
      )}
    </main>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
