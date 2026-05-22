import { useEffect, useState } from 'react';
import { ErrorKnowledge, SolutionStep } from '../../data/knowledgeBase';

interface Props {
  item: ErrorKnowledge;
  onClose: () => void;
  onSave: (item: ErrorKnowledge) => void;
}

export default function RunbookEditorModal({ item, onClose, onSave }: Props) {
  const [title, setTitle] = useState(item.title);
  const [possibleCauses, setPossibleCauses] = useState<string[]>(
    item.possibleCauses.length ? item.possibleCauses : ['']
  );
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>(
    item.solutionSteps.length ? item.solutionSteps : [{ step: 1, description: '' }]
  );

  useEffect(() => {
    setTitle(item.title);
    setPossibleCauses(item.possibleCauses.length ? item.possibleCauses : ['']);
    setSolutionSteps(item.solutionSteps.length ? item.solutionSteps : [{ step: 1, description: '' }]);
  }, [item]);

  const updateCause = (index: number, value: string) => {
    setPossibleCauses((prev) => prev.map((cause, i) => (i === index ? value : cause)));
  };

  const addCause = () => {
    setPossibleCauses((prev) => [...prev, '']);
  };

  const removeCause = (index: number) => {
    setPossibleCauses((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    setSolutionSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, description: value } : step))
    );
  };

  const addStep = () => {
    setSolutionSteps((prev) => [
      ...prev,
      {
        step: prev.length + 1,
        description: '',
      },
    ]);
  };

  const removeStep = (index: number) => {
    setSolutionSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((step, i) => ({
          ...step,
          step: i + 1,
        }))
    );
  };

  const handleSave = () => {
    const cleanTitle = title.trim();
    const cleanCauses = possibleCauses.map((cause) => cause.trim()).filter(Boolean);
    const cleanSteps = solutionSteps
      .map((step) => step.description.trim())
      .filter(Boolean)
      .map((description, index) => ({ step: index + 1, description }));

    if (!cleanTitle) {
      alert('Debe existir un título.');
      return;
    }

    if (cleanSteps.length === 0) {
      alert('Debe existir al menos un paso.');
      return;
    }

    onSave({
      ...item,
      title: cleanTitle,
      possibleCauses: cleanCauses,
      solutionSteps: cleanSteps,
      createdBy: 'Soporte Técnico',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-fade-in">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">✏️ Editar Runbook</h2>
            <p className="mt-1 text-xs text-slate-500">Modifica título, causas raíz y pasos correctivos.</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
          >
            Cerrar
          </button>
        </div>

        <div className="max-h-[80vh] space-y-6 overflow-y-auto p-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Posibles causas</h3>
              <button
                onClick={addCause}
                className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
              >
                + Añadir
              </button>
            </div>

            <div className="space-y-3">
              {possibleCauses.map((cause, index) => (
                <div key={`${item.id}-cause-${index}`} className="flex gap-2">
                  <input
                    value={cause}
                    onChange={(e) => updateCause(index, e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    onClick={() => removeCause(index)}
                    className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                  >
                    Borrar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pasos correctivos</h3>
              <button
                onClick={addStep}
                className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
              >
                + Añadir paso
              </button>
            </div>

            <div className="space-y-4">
              {solutionSteps.map((step, index) => (
                <div key={`${item.id}-step-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-emerald-700">Paso {index + 1}</span>
                    <button
                      onClick={() => removeStep(index)}
                      className="text-xs font-bold text-rose-600 transition hover:text-rose-700"
                    >
                      Eliminar
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={step.description}
                    onChange={(e) => updateStep(index, e.target.value)}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}