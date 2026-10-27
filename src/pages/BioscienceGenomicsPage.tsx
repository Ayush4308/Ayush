import React, { useState } from 'react';
import {
  Dna,
  Binary,
  Microscope,
  Activity,
  Layers,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info,
  Flame,
  Bug,
  Sparkles
} from 'lucide-react';

export const BioscienceGenomicsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sub1a' | 'hypoxia' | 'pathology' | 'alphafold'>('sub1a');

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <Dna className="w-4 h-4 text-purple-400" />
              <span>Bioscience & Molecular Crop Stress Genomics</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>ICAR & IRRI Protocols</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Crop Flood Tolerance & Submergence Biology
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Scientific genomics portal grounded in plant physiology, ethylene-ERF gene cascades,
              Rice <em>SUB1A-1</em> (UniProt Q8LP47), root lysigenous aerenchyma formation, AlphaFold structural confidence,
              and post-flood fungal/bacterial blight pathology.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/80 text-xs text-slate-200 shrink-0">
            <div className="text-emerald-400 font-semibold mb-1">Key Biological Model:</div>
            <div className="font-medium"><em>Oryza sativa</em> Submergence Tolerance 1</div>
            <div className="font-mono text-emerald-300 text-[11px] mt-0.5">UniProt: Q8LP47 · Gene: SUB1A-1</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('sub1a')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'sub1a'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Dna className="w-4 h-4" />
          Rice SUB1A-1 Gene & Dormancy
        </button>

        <button
          onClick={() => setActiveTab('hypoxia')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'hypoxia'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Root Anoxia & Aerenchyma
        </button>

        <button
          onClick={() => setActiveTab('alphafold')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'alphafold'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Microscope className="w-4 h-4" />
          AlphaFold 3D & pLDDT Confidence
        </button>

        <button
          onClick={() => setActiveTab('pathology')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'pathology'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bug className="w-4 h-4" />
          Post-Submergence Plant Blights
        </button>
      </div>

      {/* Tab 1: Rice SUB1A-1 Gene & Ethylene-ERF Cascade */}
      {activeTab === 'sub1a' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Dna className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    The Quiescence (Dormancy) Survival Mechanism
                  </h2>
                </div>
                <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                  AP2/ERF Transcription Factor
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                Most conventional rice varieties (such as standard PR-126 or Pusa Basmati) respond to flash flooding
                with the <strong>escape strategy</strong>: ethylene accumulates in submerged tissue, stimulating gibberellic
                acid (GA) synthesis. The seedling rapidly elongates its stem to reach above water, depleting non-structural
                carbohydrates within 3-4 days and starving to death under prolonged submergence.
              </p>

              <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  How <em>SUB1A-1</em> Confers 14-Day Flash Flood Survival:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-900">
                  <div className="bg-white p-3 rounded-lg border border-emerald-200/60 shadow-xs">
                    <strong>1. Ethylene Accumulation Trigger:</strong> When water submerges the plant, physical gas
                    diffusion slows 10,000-fold. Ethylene gas is trapped inside the cells and activates transcription
                    of <em>SUB1A-1</em>.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200/60 shadow-xs">
                    <strong>2. GA Repression via SLR1:</strong> SUB1A-1 upregulates <em>SLR1</em> (SLENDER RICE 1) and
                    <em>SLRL1</em>, potent DELLA repressors that block gibberellic acid signaling and shut down leaf elongation.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200/60 shadow-xs">
                    <strong>3. Carbohydrate Preservation:</strong> Instead of burning reserves on futile stem growth, starch
                    hydrolysis by alpha-amylase is curbed, saving vital sucrose for post-flood recovery.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200/60 shadow-xs">
                    <strong>4. ROS Scavenging & Fast Tillering:</strong> Once water drains away, SUB1A-1 induces antioxidant
                    enzymes (superoxide dismutase, catalase) to quench light-induced oxidative shocks and trigger vigorous tillering.
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-2">
                  Popular Indian Megavarieties Introgresed with SUB1:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-900 block">Swarna-Sub1</span>
                    <span className="text-slate-500">Released by ICAR-CRRI / IRRI for flood-prone eastern plains (Bihar, Odisha, Bengal).</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-900 block">Sambha Mahsuri-Sub1</span>
                    <span className="text-slate-500">Combines premium grain quality with 12-14 day submergence tolerance.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-900 block">CR 1009-Sub1</span>
                    <span className="text-slate-500">Widely adopted in Cauvery and coastal delta zones prone to cyclone inundation.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gene Profile Sidebar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                UniProt Genomic Specifications
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">UniProt Accession:</span>
                  <a
                    href="https://www.uniprot.org/uniprotkb/Q8LP47/entry"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    Q8LP47 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Organism:</span>
                  <span className="font-semibold text-slate-800">Oryza sativa subsp. indica (Rice)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Protein Length:</span>
                  <span className="font-semibold text-slate-800">226 Amino Acids</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Conserved Domain:</span>
                  <span className="font-semibold text-slate-800">AP2/ERF DNA-binding domain (Residues 54–121)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Chromosome:</span>
                  <span className="font-semibold text-slate-800">Chromosome 9 (Sub1 locus cluster SUB1A, SUB1B, SUB1C)</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[11px] mb-1">Donor Landrace Origin:</span>
                  <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                    Originally discovered in the flood-hardy Indian landrace <strong>FR13A</strong> from coastal Odisha.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Root Anoxia & Aerenchyma */}
      {activeTab === 'hypoxia' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Physiology of Root Hypoxia & Lysigenous Aerenchyma
                </h2>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                When soil pores become saturated with stagnant floodwater, dissolved oxygen is depleted by roots and soil
                microbes within 12–24 hours, transitioning the rhizosphere from normoxia to <strong>hypoxia</strong> and
                eventually total <strong>anoxia</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-600" />
                    Anaerobic Fermentation
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mitochondrial oxidative phosphorylation ceases. Cells upregulate <strong>PDC1</strong> (Pyruvate
                    decarboxylase) and <strong>ADH1</strong> (Alcohol dehydrogenase 1) to regenerate NAD⁺ via ethanolic
                    fermentation, yielding only 2 ATP per glucose molecule compared to 36 under aerobic respiration.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Lysigenous Aerenchyma
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    In flood-adapted crops like rice, ethylene triggers programmed cell death (PCD) in cortical cells of
                    the root. This dissolves cells to form continuous hollow longitudinal gas channels (aerenchyma),
                    funneling atmospheric O₂ from aerial leaves straight to root tips.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-700" />
                  Why Non-Adapted Crops (Cotton, Pulses, Maize) Collapse Rapidly:
                </h4>
                <p className="leading-relaxed">
                  Unlike paddy, cotton and pigeonpea (arhar) cannot form constitutive or inducible lysigenous aerenchyma.
                  Their taproot tips undergo acidosis, toxic acetaldehyde/lactate poisoning, and complete cortical death within
                  36 to 48 hours of inundation.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                Biochemical Markers of Hypoxia
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block">ADH1 Induction</span>
                  <span className="text-slate-500">Alcohol dehydrogenase activity surges 10- to 20-fold during submergence.</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block">Suberin Barrier</span>
                  <span className="text-slate-500">Development of outer apoplastic barriers prevents radial oxygen loss (ROL) into anoxic mud.</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block">Ethylene Biosynthesis</span>
                  <span className="text-slate-500">ACC oxidase (ACO) accumulates in flooded root tissues, accelerating aerenchyma hollows.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AlphaFold 3D & Structural Confidence */}
      {activeTab === 'alphafold' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    AlphaFold Structure Prediction & pLDDT Confidence
                  </h2>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200 font-semibold">
                  AF-Q8LP47-F1
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                AlphaFold Database predicts the 3D atomic coordinates of the rice SUB1A-1 transcription factor
                (UniProt ID: <strong>Q8LP47</strong>). The structure contains a well-folded central AP2/ERF DNA-binding domain
                flanked by flexible regulatory terminal extensions.
              </p>

              {/* AlphaFold Confidence Scale (DeepMind Science Directive) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
                  AlphaFold pLDDT 4-Band Confidence Scale
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
                    <span className="font-bold block">Very High (&gt; 90)</span>
                    <span className="text-[10px] text-blue-100">Highly reliable side-chain & backbone geometry.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-500 text-white shadow-xs">
                    <span className="font-bold block">Confident (70 - 90)</span>
                    <span className="text-[10px] text-cyan-100">Solid backbone and secondary structure fold.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-400 text-slate-900 shadow-xs">
                    <span className="font-bold block">Low (50 - 70)</span>
                    <span className="text-[10px] text-slate-800">Potential flexible loops or disordered links.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-orange-500 text-white shadow-xs">
                    <span className="font-bold block">Very Low (&lt; 50)</span>
                    <span className="text-[10px] text-orange-100">Intrinsically disordered region (IDR).</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-2 text-xs text-indigo-950">
                <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  Structural Domain Synthesis for SUB1A-1 (Q8LP47):
                </h4>
                <p className="leading-relaxed">
                  The AP2/ERF DNA-binding domain (Residues 54 to 121) exhibits high structural confidence (&gt;85 pLDDT),
                  forming a three-stranded antiparallel beta-sheet packed against an alpha-helix that binds the GCC-box promoter
                  element of downstream GA-repressor genes. The N- and C-terminal tails show lower pLDDT (&lt;60), characteristic of
                  intrinsically disordered transactivation domains that recruit transcriptional machinery.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href="https://alphafold.ebi.ac.uk/entry/Q8LP47"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
                >
                  View Interactive 3D Model on AlphaFold DB <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-xs text-slate-500">
                  Direct European Bioinformatics Institute (EMBL-EBI) Reference
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                AlphaFold Database Metadata
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Model Identifier:</span>
                  <span className="font-mono font-semibold text-slate-800">AF-Q8LP47-F1</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Global Mean pLDDT:</span>
                  <span className="font-mono font-bold text-emerald-600">76.4 (Confident Fold)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Domain:</span>
                  <span className="font-semibold text-slate-800">AP2/ERF domain (54-121)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Predicted Aligned Error (PAE):</span>
                  <span className="text-slate-600">Rigid single domain with flexible inter-terminal links.</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[11px] mb-1">Downstream Utility:</span>
                  <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                    Used by ICAR & IRRI bioinformaticians to screen natural allelic variants across wild rice germplasms (<em>Oryza rufipogon</em>).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Post-Flood Crop Blights & Pathogens */}
      {activeTab === 'pathology' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Bug className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Post-Flood Crop Pathogens & Waterborne Disease Outbreaks
              </h2>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              When floodwater recedes, plants suffer micro-abrasions from river silt particles, high atmospheric humidity,
              and weakened cell wall pectin. This creates an open doorway for severe bacterial and fungal pathogens:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Disease 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Bacterial Leaf Blight</span>
                  <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-semibold">Bacterial</span>
                </div>
                <span className="italic text-slate-500 block">Xanthomonas oryzae pv. oryzae</span>
                <p className="text-slate-600 leading-relaxed">
                  Water-soaked lesions on leaf tips turning yellowish-white with wavy margins. Silt-laden floodwaters carry
                  bacterial ooze across entire contiguous village command areas.
                </p>
                <div className="pt-2 border-t border-slate-200 text-slate-800">
                  <strong>Agronomic Remediation:</strong> Spray Streptocycline (100 ppm) + Copper Oxychloride (2.5 g/L). Avoid nitrogen top-dressing.
                </div>
              </div>

              {/* Disease 2 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Sheath Blight</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-semibold">Fungal</span>
                </div>
                <span className="italic text-slate-500 block">Rhizoctonia solani</span>
                <p className="text-slate-600 leading-relaxed">
                  Oval or irregular greenish-grey spots on leaf sheaths just above the water level, resembling snake skins. Sclerotia
                  float on floodwater and adhere to tillers.
                </p>
                <div className="pt-2 border-t border-slate-200 text-slate-800">
                  <strong>Agronomic Remediation:</strong> Foliar spray Validamycin 3L (2.5 ml/L) or Hexaconazole 5% EC (2 ml/L) aimed at base of tillers.
                </div>
              </div>

              {/* Disease 3 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Root Rot & Damping-Off</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-semibold">Oomycete</span>
                </div>
                <span className="italic text-slate-500 block">Phytophthora & Pythium spp.</span>
                <p className="text-slate-600 leading-relaxed">
                  Prevalent in cotton, pulses (moong/urad), and vegetables. Flagellated zoospores swim actively in stagnant water,
                  penetrating the root collar and causing wilting.
                </p>
                <div className="pt-2 border-t border-slate-200 text-slate-800">
                  <strong>Agronomic Remediation:</strong> Soil drenching with Metalaxyl + Mancozeb (2 g/L) or biological application of <em>Trichoderma viride</em>.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
