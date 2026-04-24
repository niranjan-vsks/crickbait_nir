import { useState } from 'react';
import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import AppShell from '../components/layout/AppShell';
import { useToast } from '../components/ui/Toast';
import { useMatches } from '../hooks/useMatches';
import { IPL_TEAMS, MATCH_STATUSES } from '../utils/constants';
import { triggerScoring } from '../utils/triggerScoring';
import { Shield, Plus, Zap, ChevronRight, CheckCircle } from 'lucide-react';

const TABS = ['MATCHES', 'RESULT ENTRY', 'CREATE MATCH'];

const STATUS_OPTIONS = Object.values(MATCH_STATUSES);

const INPUT_CLS =
  'w-full bg-[#1b1f2c] border border-[#313442] rounded-lg px-3 py-2 text-[#dfe2f3] text-sm focus:outline-none focus:border-[#f97316] transition-colors';
const LABEL_CLS =
  'block text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1] mb-1';

function StatusBadge({ status }) {
  const map = {
    [MATCH_STATUSES.UPCOMING]: 'bg-[#313442] text-[#6B7280]',
    [MATCH_STATUSES.LIVE]: 'bg-[#4ae176]/20 text-[#4ae176] border border-[#4ae176]/30',
    [MATCH_STATUSES.COMPLETED]: 'bg-[#ffc640]/20 text-[#ffc640] border border-[#ffc640]/30',
    [MATCH_STATUSES.ABANDONED]: 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30',
    [MATCH_STATUSES.DLS]: 'bg-[#ffc640]/20 text-[#ffc640] border border-[#ffc640]/30',
    [MATCH_STATUSES.NO_RESULT]: 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${map[status] ?? 'bg-[#313442] text-[#6B7280]'}`}>
      {status}
    </span>
  );
}

function MatchesTab({ matches, loading, onEdit }) {
  return (
    <div className="bg-[#171b28] border border-[#313442] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#313442] bg-[#1b1f2c]/50">
        <h3 className="text-sm font-bold text-[#dfe2f3]">All Fixtures</h3>
      </div>
      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-[#313442] border-t-[#f97316] rounded-full animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <p className="p-6 text-center text-[#6B7280] text-sm">No matches found.</p>
      ) : (
        <div className="divide-y divide-[#313442]">
          {matches.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-[#1b1f2c] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
                    #{m.matchNumber}
                  </span>
                  <StatusBadge status={m.status} />
                  {m.scored && (
                    <CheckCircle className="w-3 h-3 text-[#4ae176]" />
                  )}
                </div>
                <p className="text-sm font-bold text-[#dfe2f3] truncate">
                  {m.team1} vs {m.team2}
                </p>
                <p className="text-[11px] text-[#6B7280] truncate">{m.venue}</p>
              </div>
              <button
                onClick={() => onEdit(m)}
                className="flex items-center gap-1 text-[#f97316] text-[11px] font-bold uppercase tracking-widest hover:text-[#fb923c] transition-colors ml-3 shrink-0"
              >
                Edit <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultEntryTab({ match, setActiveTab }) {
  const { show } = useToast();
  const [status, setStatus] = useState(match?.status ?? MATCH_STATUSES.UPCOMING);
  const [winner, setWinner] = useState(match?.result?.winner ?? '');
  const [potm, setPotm] = useState(match?.result?.potm ?? '');
  const [innings, setInnings] = useState(match?.result?.firstInningsScore ?? '');
  const [isDLS, setIsDLS] = useState(match?.isDLS ?? false);
  const [playerRows, setPlayerRows] = useState(() => {
    const ps = match?.result?.playerStats ?? {};
    const entries = Object.entries(ps);
    return entries.length > 0
      ? entries.map(([name, stats]) => ({ name, runs: String(stats.runs ?? ''), wickets: String(stats.wickets ?? '') }))
      : [{ name: '', runs: '', wickets: '' }];
  });
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);

  if (!match) {
    return (
      <div className="bg-[#171b28] border border-[#313442] rounded-xl p-8 flex flex-col items-center gap-3">
        <Shield className="w-10 h-10 text-[#6B7280]" />
        <p className="text-[#6B7280] text-sm font-semibold">Select a match from the Matches tab</p>
        <button
          onClick={() => setActiveTab('MATCHES')}
          className="text-[#f97316] text-[11px] font-bold uppercase tracking-widest hover:underline"
        >
          Go to Matches
        </button>
      </div>
    );
  }

  function addRow() {
    setPlayerRows((r) => [...r, { name: '', runs: '', wickets: '' }]);
  }

  function removeRow(i) {
    setPlayerRows((r) => r.filter((_, idx) => idx !== i));
  }

  function updateRow(i, field, val) {
    setPlayerRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const playerStats = {};
      for (const row of playerRows) {
        if (row.name.trim()) {
          playerStats[row.name.trim()] = {
            runs: Number(row.runs) || 0,
            wickets: Number(row.wickets) || 0,
          };
        }
      }

      const result = {
        winner: winner || null,
        potm: potm.trim() || null,
        firstInningsScore: innings !== '' ? Number(innings) : null,
        playerStats,
      };

      await setDoc(
        doc(db, 'matches', match.id),
        { status, isDLS, result },
        { merge: true }
      );

      show('Result saved successfully', 'success');
    } catch (err) {
      show('Failed to save result', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleTrigger() {
    setTriggering(true);
    try {
      const matchWithResult = {
        ...match,
        status,
        isDLS,
        result: {
          winner: winner || null,
          potm: potm.trim() || null,
          firstInningsScore: innings !== '' ? Number(innings) : null,
          playerStats: Object.fromEntries(
            playerRows
              .filter((r) => r.name.trim())
              .map((r) => [r.name.trim(), { runs: Number(r.runs) || 0, wickets: Number(r.wickets) || 0 }])
          ),
        },
      };
      const count = await triggerScoring(matchWithResult);
      show(`Scoring complete — ${count} prediction(s) scored`, 'success');
    } catch (err) {
      show('Scoring failed: ' + err.message, 'error');
    } finally {
      setTriggering(false);
    }
  }

  const canTrigger = match.result && !match.scored;

  return (
    <div className="bg-[#171b28] border border-[#313442] rounded-xl overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#f97316] to-[#ffc640]" />
      <div className="p-4 border-b border-[#313442] bg-[#1b1f2c]/50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#e0c0b1] mb-0.5">
          Match #{match.matchNumber}
        </p>
        <h2 className="text-lg font-bold text-[#dfe2f3]">
          {match.team1} vs {match.team2}
        </h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLS}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={INPUT_CLS}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL_CLS}>Winner</label>
            <select
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              className={INPUT_CLS}
            >
              <option value="">— No winner —</option>
              <option value={match.team1}>{match.team1}</option>
              <option value={match.team2}>{match.team2}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLS}>Player of the Match</label>
            <input
              type="text"
              value={potm}
              onChange={(e) => setPotm(e.target.value)}
              placeholder="Player name"
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>1st Innings Score</label>
            <input
              type="number"
              value={innings}
              onChange={(e) => setInnings(e.target.value)}
              placeholder="e.g. 185"
              className={INPUT_CLS}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="dls-check"
            type="checkbox"
            checked={isDLS}
            onChange={(e) => setIsDLS(e.target.checked)}
            className="w-4 h-4 accent-[#f97316]"
          />
          <label htmlFor="dls-check" className="text-[11px] font-bold uppercase tracking-widest text-[#e0c0b1]">
            DLS applied
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={LABEL_CLS}>Player Stats</label>
            <button
              onClick={addRow}
              className="flex items-center gap-1 text-[#f97316] text-[10px] font-bold uppercase tracking-widest hover:text-[#fb923c] transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Row
            </button>
          </div>
          <div className="space-y-2">
            {playerRows.map((row, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => updateRow(i, 'name', e.target.value)}
                  placeholder="Player name"
                  className={`${INPUT_CLS} flex-[3]`}
                />
                <input
                  type="number"
                  value={row.runs}
                  onChange={(e) => updateRow(i, 'runs', e.target.value)}
                  placeholder="Runs"
                  className={`${INPUT_CLS} flex-1`}
                />
                <input
                  type="number"
                  value={row.wickets}
                  onChange={(e) => updateRow(i, 'wickets', e.target.value)}
                  placeholder="Wkts"
                  className={`${INPUT_CLS} flex-1`}
                />
                <button
                  onClick={() => removeRow(i)}
                  className="text-[#ffb4ab] hover:text-[#ff6b6b] text-lg leading-none font-bold px-1 shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 space-y-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#f97316] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ea6c0e] transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            Save Result
          </button>

          <button
            onClick={handleTrigger}
            disabled={!canTrigger || triggering}
            className="w-full bg-[#93000a]/20 border border-[#ffb4ab]/20 text-[#ffb4ab] font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#93000a]/30 transition-colors disabled:opacity-40 text-sm"
          >
            {triggering ? (
              <div className="w-4 h-4 border-2 border-[#ffb4ab]/30 border-t-[#ffb4ab] rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Trigger Scoring
          </button>
          {!canTrigger && (
            <p className="text-center text-[10px] text-[#6B7280] uppercase tracking-widest">
              {match.scored
                ? 'Already scored'
                : 'Save result first to enable scoring'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateMatchTab() {
  const { show } = useToast();
  const [team1, setTeam1] = useState(IPL_TEAMS[0]);
  const [team2, setTeam2] = useState(IPL_TEAMS[1]);
  const [venue, setVenue] = useState('');
  const [matchNumber, setMatchNumber] = useState('');
  const [startTime, setStartTime] = useState('');
  const [status, setStatus] = useState(MATCH_STATUSES.UPCOMING);
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!venue.trim() || !matchNumber || !startTime) {
      show('Please fill all fields', 'error');
      return;
    }
    if (team1 === team2) {
      show('Team 1 and Team 2 must be different', 'error');
      return;
    }
    setCreating(true);
    try {
      await addDoc(collection(db, 'matches'), {
        team1,
        team2,
        venue: venue.trim(),
        matchNumber: Number(matchNumber),
        startTime: Timestamp.fromDate(new Date(startTime)),
        status,
        score1: null,
        overs1: null,
        score2: null,
        overs2: null,
        target: null,
        winProbTeam1: null,
        result: null,
        isDLS: false,
        scored: false,
      });
      show('Match created', 'success');
      setVenue('');
      setMatchNumber('');
      setStartTime('');
      setStatus(MATCH_STATUSES.UPCOMING);
    } catch (err) {
      show('Failed to create match', 'error');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="bg-[#171b28] border border-[#313442] rounded-xl p-4 space-y-4">
      <h2 className="text-sm font-bold text-[#dfe2f3]">New Match</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLS}>Team 1</label>
          <select value={team1} onChange={(e) => setTeam1(e.target.value)} className={INPUT_CLS}>
            {IPL_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_CLS}>Team 2</label>
          <select value={team2} onChange={(e) => setTeam2(e.target.value)} className={INPUT_CLS}>
            {IPL_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>Venue</label>
        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="e.g. Wankhede Stadium"
          className={INPUT_CLS}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLS}>Match Number</label>
          <input
            type="number"
            value={matchNumber}
            onChange={(e) => setMatchNumber(e.target.value)}
            placeholder="e.g. 42"
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={INPUT_CLS}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className={INPUT_CLS}
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={creating}
        className="w-full bg-[#f97316] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ea6c0e] transition-colors disabled:opacity-50 text-sm"
      >
        {creating ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Create Match
      </button>
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('MATCHES');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { matches, loading } = useMatches();

  function handleEdit(match) {
    setSelectedMatch(match);
    setActiveTab('RESULT ENTRY');
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#f97316]" />
          <h1 className="text-xl font-black text-[#dfe2f3] uppercase tracking-tight">Admin Panel</h1>
        </div>

        <div className="flex gap-0 mb-4 bg-[#171b28] border border-[#313442] rounded-lg p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-[#f97316] text-white'
                  : 'text-[#6B7280] hover:text-[#dfe2f3]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'MATCHES' && (
          <MatchesTab matches={matches} loading={loading} onEdit={handleEdit} />
        )}
        {activeTab === 'RESULT ENTRY' && (
          <ResultEntryTab match={selectedMatch} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'CREATE MATCH' && <CreateMatchTab />}
      </div>
    </AppShell>
  );
}
