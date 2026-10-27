import React from 'react';
import { useApp } from '../context/AppContext';
import { CROPS_DATA } from '../data/crops';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ShieldAlert,
  Sprout,
  ArrowRight,
  Package,
  Wrench,
  Info
} from 'lucide-react';

export const CropPlannerPage: React.FC = () => {
  const { t, activeFarm, checklistProgress, toggleChecklistItem, setActivePage } = useApp();

  const cropInfo = activeFarm ? CROPS_DATA[activeFarm.cropType] : null;
  const currentStageInfo = cropInfo?.stages.find((s) => s.stage === activeFarm?.growthStage);

  const completedCount = cropInfo
    ? cropInfo.preFloodChecklist.filter((i) => !!checklistProgress[i.id]).length
    : 0;
  const totalCount = cropInfo ? cropInfo.preFloodChecklist.length : 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {t.planner.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.planner.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-2xl border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold block mb-0.5">{t.planner.safetyCaution}</strong>
          Human safety always supersedes equipment or harvest preservation. Never step into swelling drains or fast currents to unblock silt.
        </div>
      </div>

      {activeFarm && cropInfo && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.planner.cropStageHeader}: {cropInfo.nativeNames.en}
              </h2>
            </div>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full uppercase">
              Stage: {activeFarm.growthStage}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 uppercase">Crop Flood Tolerance</div>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1 capitalize">
                {cropInfo.floodTolerance} Tolerance
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Max safe waterlogging duration: <strong>{cropInfo.maxSubmergenceHours} Hours</strong> before severe irreversible root anoxia.
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 uppercase">Current Growth Vulnerability</div>
              <div className="text-xs text-slate-800 dark:text-slate-200 mt-1 leading-relaxed font-medium">
                {currentStageInfo?.vulnerabilityNotice.en || 'Vulnerability varies with duration and silt load.'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-700 dark:text-slate-300">
            Preparedness Tasks Completed: {completedCount} of {totalCount}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}% Ready</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-emerald-500" />
          <span>{t.planner.checklistHeader}</span>
        </h2>

        {cropInfo?.preFloodChecklist.map((item) => {
          const isDone = !!checklistProgress[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  className="mt-0.5 text-emerald-600 dark:text-emerald-400 focus:outline-none"
                  aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${
                      isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.category}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.urgency === 'immediate'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {item.urgency}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                    {item.description}
                  </p>

                  {item.safetyWarning && (
                    <div className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-900/40">
                      ⚠️ {item.safetyWarning}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-100 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          {t.planner.disclaimer}
        </div>
      </div>
    </div>
  );
};
