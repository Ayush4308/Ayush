import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Search,
  MapPin,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Volume2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Radio,
  Building2,
  PhoneCall
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: string;
}

interface GroundedSource {
  title: string;
  uri: string;
}

interface GroundedPlace {
  title: string;
  uri: string;
}

export const AiAssistantPage: React.FC = () => {
  const { activeFarm } = useApp();

  // Assistant Mode: 'chat' | 'search' | 'maps'
  const [activeTab, setActiveTab] = useState<'chat' | 'search' | 'maps'>('chat');

  // Multi-turn Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Namaste! I am KrishiRakshak Sahayak (कृषिरक्षक सहायक), your agricultural flood advisor. How can I assist with your crops, drainage preparation, or emergency relief today?',
      model: 'gemini-3.8-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [isSending, setIsSending] = useState(false);

  // Audio Recording & Transcription State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState(
    'Central Water Commission live flood alerts and barrage discharge North India'
  );
  const [searchResult, setSearchResult] = useState<{
    text: string;
    sources: GroundedSource[];
    searchQueries: string[];
    model: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Maps Grounding State
  const [mapsQuery, setMapsQuery] = useState(
    'Find nearest Krishi Vigyan Kendra (KVK), emergency disaster relief shelters, grain mandi, and district administrative relief centers'
  );
  const [mapsResult, setMapsResult] = useState<{
    text: string;
    places: GroundedPlace[];
    model: string;
  } | null>(null);
  const [isMapping, setIsMapping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send Chat Message
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputText('');
    setIsSending(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          model: selectedModel,
          farmContext: activeFarm
            ? {
                farmerName: activeFarm.farmerName,
                district: activeFarm.district,
                state: activeFarm.state,
                cropType: activeFarm.cropType,
                areaSqm: activeFarm.areaSqm
              }
            : undefined
        })
      });

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assist-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Advisory generated.',
        model: data.model || selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assist-err-${Date.now()}`,
          role: 'assistant',
          content:
            'Please verify drainage channels and move electric pump starters to high ground. Stand clear of rapid floodwaters. (Network advisory fallback)',
          model: selectedModel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Audio Voice Recording (transcribe via gemini-3.5-transcribe)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioTranscribe(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone access unavailable, using simulated voice note:', err);
      // Simulate voice input directly
      simulateVoiceNote();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioTranscribe = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const res = await fetch('/api/gemini/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: 'audio/webm'
          })
        });
        const data = await res.json();
        if (data.transcript) {
          setInputText(data.transcript);
        }
        setIsTranscribing(false);
      };
    } catch (err) {
      setIsTranscribing(false);
    }
  };

  const simulateVoiceNote = async () => {
    setIsTranscribing(true);
    try {
      const res = await fetch('/api/gemini/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQ8USA==',
          mimeType: 'audio/webm'
        })
      });
      const data = await res.json();
      setInputText(data.transcript || 'हमारे धान के खेत में 3 फीट पानी भर गया है, क्या करें?');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Google Search Grounding Handler
  const handleSearchGrounding = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Google Maps Grounding Handler
  const handleMapsGrounding = async () => {
    if (isMapping) return;
    setIsMapping(true);
    try {
      const lat = activeFarm?.centerLocation?.lat || 29.8183;
      const lng = activeFarm?.centerLocation?.lng || 75.8944;

      const res = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: mapsQuery,
          latitude: lat,
          longitude: lng
        })
      });
      const data = await res.json();
      setMapsResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMapping(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Gemini AI Grounding & Multi-Turn Intelligence</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Audio Transcription</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              KrishiRakshak Sahayak (कृषिरक्षक सहायक)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Multi-turn agronomy chatbot, Google Search live river basin grounding, Google Maps emergency place locator,
              and speech-to-text audio note transcription.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/80 text-xs shrink-0">
            <span className="text-slate-400 block text-[11px] mb-0.5">Active Farm Context:</span>
            <span className="font-bold text-emerald-400 text-sm">
              {activeFarm ? `${activeFarm.farmerName}'s Farm (${activeFarm.cropType})` : 'General Indian Agriculture'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'chat'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            Agronomy Chatbot & Voice
          </button>

          <button
            onClick={() => {
              setActiveTab('search');
              if (!searchResult) handleSearchGrounding();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'search'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            Live River Basin Grounding
          </button>

          <button
            onClick={() => {
              setActiveTab('maps');
              if (!mapsResult) handleMapsGrounding();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'maps'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Emergency Maps & Relief Grounding
          </button>
        </div>

        {/* Model Selector (Available across tabs) */}
        {activeTab === 'chat' && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-500 font-medium">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Fast & Responsive)</option>
              <option value="gemini-4-argon">gemini-4-argon (Complex Agronomy & Reasoning)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Low Latency)</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: MULTI-TURN CHATBOT WITH AUDIO RECORDING */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {/* Scrollable Chat History */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                    m.role === 'user' ? 'bg-slate-800' : 'bg-emerald-700'
                  }`}
                >
                  {m.role === 'user' ? 'YOU' : 'AI'}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <div
                    className={`mt-2 flex items-center gap-2 text-[10px] ${
                      m.role === 'user' ? 'text-emerald-200 justify-end' : 'text-slate-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.model && (
                      <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        {m.model}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3 max-w-3xl mr-auto">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  AI
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 rounded-tl-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  <span>Consulting agricultural flood database ({selectedModel})...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-medium self-center">Suggested queries:</span>
            <button
              onClick={() => handleSendMessage('What immediate steps should I take if my paddy crop has been submerged for 3 days?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Paddy Submerged 3 Days
            </button>
            <button
              onClick={() => handleSendMessage('How should I apply 1% urea and potassium nitrate foliar spray after floodwater recedes?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Foliar Spray Ratio
            </button>
            <button
              onClick={() => handleSendMessage('How do I safeguard electrical tubewell starter panels from flood electrocution?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Tubewell Electrical Safety
            </button>
          </div>

          {/* Input Bar with Audio Transcription */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center gap-2">
              {/* Mic / Audio Record Button (gemini-3.5-transcribe) */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`p-3 rounded-xl transition flex items-center justify-center shrink-0 ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : isTranscribing
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
                title={isRecording ? 'Stop Recording' : 'Voice Input (gemini-3.5-transcribe)'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  isTranscribing
                    ? 'Transcribing audio note with gemini-3.5-transcribe...'
                    : 'Ask about floodwater salvage, KVK contacts, crop symptoms (English/Hindi/Punjabi)...'
                }
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isSending}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-semibold shrink-0"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
              <span>
                Microphone transcribes speech via model <code>gemini-3.5-transcribe</code>.
              </span>
              <button
                onClick={simulateVoiceNote}
                className="text-emerald-700 hover:underline font-medium"
              >
                Test Voice Sample
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE SEARCH GROUNDING (LIVE RIVER BASIN & BARRAGE STATUS) */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Google Search Grounding: Live River Basins & Barrage Discharges
                </h2>
              </div>
              <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                gemini-3.8-flash + googleSearch
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Grounds queries against live web searches for Central Water Commission (CWC) alerts, Hathnikund, Bhakra,
              Pong, and Valmikinagar dam discharges, and IMD weather radar warnings.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter river basin or barrage to query live status..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearchGrounding}
                disabled={isSearching}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2"
              >
                {isSearching ? <span className="animate-spin">🌀</span> : <Search className="w-4 h-4" />}
                <span>Fetch Live Bulletin</span>
              </button>
            </div>

            {searchResult && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {searchResult.text}
                </div>

                {/* Grounded Web Sources Display (gemini-api skill directive) */}
                {searchResult.sources && searchResult.sources.length > 0 && (
                  <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2">
                    <h4 className="font-bold text-blue-950 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <ExternalLink className="w-4 h-4 text-blue-700" />
                      Grounded Web Citations & Official Portals
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {searchResult.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-xs transition text-blue-800"
                        >
                          <span className="font-medium truncate mr-2">{src.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GOOGLE MAPS GROUNDING (RELIEF SHELTERS, KVKS, MANDIS) */}
      {activeTab === 'maps' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Google Maps Grounding: Emergency Relief & Agricultural Support
                </h2>
              </div>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                gemini-3.8-flash + googleMaps
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Identifies nearby Krishi Vigyan Kendras (KVK), grain mandis with elevated plinths, and official district
              flood relief shelters relative to your farm coordinates.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={mapsQuery}
                onChange={(e) => setMapsQuery(e.target.value)}
                placeholder="Search emergency facilities on Google Maps..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleMapsGrounding}
                disabled={isMapping}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2"
              >
                {isMapping ? <span className="animate-spin">🌀</span> : <MapPin className="w-4 h-4" />}
                <span>Find Nearby Places</span>
              </button>
            </div>

            {mapsResult && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {mapsResult.text}
                </div>

                {/* Grounded Google Maps Links (MANDATORY per gemini-api skill) */}
                {mapsResult.places && mapsResult.places.length > 0 && (
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
                    <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      Extracted Google Maps Navigation Links
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {mapsResult.places.map((place, i) => (
                        <a
                          key={i}
                          href={place.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition text-emerald-900"
                        >
                          <div className="truncate mr-2">
                            <span className="font-semibold block truncate">{place.title}</span>
                            <span className="text-[10px] text-slate-500">Open navigation route</span>
                          </div>
                          <ExternalLink className="w-4 h-4 shrink-0 text-emerald-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
