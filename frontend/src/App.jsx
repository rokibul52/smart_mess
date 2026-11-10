import React, { useState, useEffect, useMemo } from 'react';
import './index.css';

// ডেমো ডাটা সেট
const INITIAL_DEMO_MEMBERS = [
  { id: 1, name: 'রকিবুল ইসলাম', bazarCost: 4500, riceCost: 650, totalMeal: 45, roomRent: 3500 },
  { id: 2, name: 'তানভীর আহমেদ', bazarCost: 3200, riceCost: 650, totalMeal: 40, roomRent: 3500 },
  { id: 3, name: 'মাহমুদ হাসান', bazarCost: 1500, riceCost: 650, totalMeal: 38, roomRent: 3500 },
  { id: 4, name: 'সাকিব আল হাসান', bazarCost: 6000, riceCost: 650, totalMeal: 50, roomRent: 3500 },
  { id: 5, name: 'আরিফুল ইসলাম', bazarCost: 2000, riceCost: 650, totalMeal: 35, roomRent: 3500 },
];

const INITIAL_DEMO_UTILITY = {
  gasBill: 1200,
  electricityBill: 1850,
  liftBill: 600,
  wifiBill: 800,
  khalaBill: 2500,
  garbageBill: 150,
};

function App() {
  // মেম্বার তালিকা ও ইউটিলিটি স্টেট (লোকাল স্টোরেজ থেকে রিড)
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('smart_mess_members');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_MEMBERS;
  });

  const [utility, setUtility] = useState(() => {
    const saved = localStorage.getItem('smart_mess_utility');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_UTILITY;
  });

  // থিম স্টেট (ডার্ক / লাইট)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('smart_mess_theme');
    return saved === 'dark';
  });

  // ফর্ম স্টেট
  const [name, setName] = useState('');
  const [bazarCost, setBazarCost] = useState('');
  const [riceCost, setRiceCost] = useState('');
  const [totalMeal, setTotalMeal] = useState('');
  const [roomRent, setRoomRent] = useState('');
  const [editingId, setEditingId] = useState(null);

  // ফিল্টার ও নোটিফিকেশন
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'slips'

  // লোকাল স্টোরেজে সেভ
  useEffect(() => {
    localStorage.setItem('smart_mess_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('smart_mess_utility', JSON.stringify(utility));
  }, [utility]);

  useEffect(() => {
    localStorage.setItem('smart_mess_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // টোস্ট নোটিফিকেশন দেখানো
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ইউটিলিটি ইনপুট হ্যান্ডলার
  const handleUtilityChange = (e) => {
    const { name: fieldName, value } = e.target;
    setUtility((prev) => ({
      ...prev,
      [fieldName]: parseFloat(value) || 0,
    }));
  };

  // মেম্বার সাবমিট (যোগ বা এডিট)
  const handleSubmitMember = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      showToast('⚠️ মেম্বারের নাম ফাঁকা রাখা যাবে না!');
      return;
    }

    if (!editingId) {
      const exists = members.find((m) => m.name.toLowerCase() === trimmedName.toLowerCase());
      if (exists) {
        showToast(`⚠️ '${trimmedName}' নামের মেম্বার ইতিমধ্যেই আছে!`);
        return;
      }
      const newMember = {
        id: Date.now(),
        name: trimmedName,
        bazarCost: parseFloat(bazarCost) || 0,
        riceCost: parseFloat(riceCost) || 0,
        totalMeal: parseFloat(totalMeal) || 0,
        roomRent: parseFloat(roomRent) || 0,
      };
      setMembers([...members, newMember]);
      showToast('✅ নতুন মেম্বার যুক্ত হয়েছে!');
    } else {
      setMembers(
        members.map((m) =>
          m.id === editingId
            ? {
                ...m,
                name: trimmedName,
                bazarCost: parseFloat(bazarCost) || 0,
                riceCost: parseFloat(riceCost) || 0,
                totalMeal: parseFloat(totalMeal) || 0,
                roomRent: parseFloat(roomRent) || 0,
              }
            : m
        )
      );
      setEditingId(null);
      showToast('✅ মেম্বার তথ্য আপডেট হয়েছে!');
    }

    // ফিল্ড ক্লিয়ার
    setName('');
    setBazarCost('');
    setRiceCost('');
    setTotalMeal('');
    setRoomRent('');
  };

  // এডিট শুরু
  const handleEdit = (member) => {
    setEditingId(member.id);
    setName(member.name);
    setBazarCost(member.bazarCost || '');
    setRiceCost(member.riceCost || '');
    setTotalMeal(member.totalMeal || '');
    setRoomRent(member.roomRent || '');
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setBazarCost('');
    setRiceCost('');
    setTotalMeal('');
    setRoomRent('');
  };

  // মেম্বার মুছা
  const handleRemoveMember = (id, memberName) => {
    if (window.confirm(`আপনি কি সত্যিই '${memberName}'-কে মুছে ফেলতে চান?`)) {
      setMembers(members.filter((m) => m.id !== id));
      showToast(`🗑️ '${memberName}' অপসারিত হয়েছে`);
      if (editingId === id) handleCancelEdit();
    }
  };

  // সম্পূর্ণ রিসেট
  const handleResetAll = () => {
    if (window.confirm('সতর্কতা: আপনি কি নিশ্চিত যে সমস্ত মেম্বার ও ডাটা রিসেট করতে চান?')) {
      setMembers([]);
      setUtility({
        gasBill: 0,
        electricityBill: 0,
        liftBill: 0,
        wifiBill: 0,
        khalaBill: 0,
        garbageBill: 0,
      });
      handleCancelEdit();
      showToast('🧹 সব ডাটা ক্লিয়ার করা হয়েছে');
    }
  };

  // ডেমো ডাটা লোড
  const handleLoadDemo = () => {
    setMembers(INITIAL_DEMO_MEMBERS);
    setUtility(INITIAL_DEMO_UTILITY);
    showToast('✨ ডেমো ডাটা লোড সম্পন্ন হয়েছে');
  };

  // সামগ্রিক গণনা
  const totalMembers = members.length;
  const totalBazarCost = useMemo(() => members.reduce((sum, m) => sum + (m.bazarCost || 0), 0), [members]);
  const totalRiceCost = useMemo(() => members.reduce((sum, m) => sum + (m.riceCost || 0), 0), [members]);
  const totalMealCost = totalBazarCost + totalRiceCost;
  const subTotalMeal = useMemo(() => members.reduce((sum, m) => sum + (m.totalMeal || 0), 0), [members]);

  const mealRate = subTotalMeal > 0 ? totalMealCost / subTotalMeal : 0;

  const totalUtilityCost = useMemo(
    () =>
      (utility.gasBill || 0) +
      (utility.electricityBill || 0) +
      (utility.liftBill || 0) +
      (utility.wifiBill || 0) +
      (utility.khalaBill || 0) +
      (utility.garbageBill || 0),
    [utility]
  );

  const perPersonUtilityCost = totalMembers > 0 ? totalUtilityCost / totalMembers : 0;
  const grandTotalMessExpense = totalMealCost + totalUtilityCost;

  // প্রতিটি মেম্বারের ফাইনান্সিয়াল ক্যালকুলেশন
  const calculatedMembers = useMemo(() => {
    return members.map((m) => {
      const totalCost = (m.bazarCost || 0) + (m.riceCost || 0);
      const perMealCost = (m.totalMeal || 0) * mealRate;
      const mealPlusUtility = perMealCost + perPersonUtilityCost;
      const rawFinancialPosition = totalCost - (mealPlusUtility + (m.roomRent || 0));

      let ceilingValue = 0;
      if (rawFinancialPosition > 0) {
        ceilingValue = Math.ceil(rawFinancialPosition);
      } else if (rawFinancialPosition < 0) {
        ceilingValue = Math.floor(rawFinancialPosition);
      }

      return {
        ...m,
        totalCost,
        perMealCost,
        mealPlusUtility,
        rawFinancialPosition,
        ceilingValue,
      };
    });
  }, [members, mealRate, perPersonUtilityCost]);

  // ফিল্টার করা তালিকা
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return calculatedMembers;
    return calculatedMembers.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [calculatedMembers, searchTerm]);

  // ক্যাশ হিসাব ও সমতা
  const totalReceivable = useMemo(
    () => calculatedMembers.filter((m) => m.ceilingValue > 0).reduce((sum, m) => sum + m.ceilingValue, 0),
    [calculatedMembers]
  );
  const totalPayable = useMemo(
    () => calculatedMembers.filter((m) => m.ceilingValue < 0).reduce((sum, m) => sum + Math.abs(m.ceilingValue), 0),
    [calculatedMembers]
  );

  // মেম্বার স্লিপ হোয়াটসঅ্যাপে শেয়ার বা ক্লিপবোর্ডে কপি
  const handleCopySlip = (m) => {
    const statusText =
      m.ceilingValue >= 0
        ? `✅ মেস থেকে পাবেন: ৳ ${m.ceilingValue}`
        : `🔻 মেসে পরিশোধ করবেন: ৳ ${Math.abs(m.ceilingValue)}`;

    const slip = `📋 মেস মিল ও বিল স্লিপ
👤 নাম: ${m.name}
━━━━━━━━━━━━━━━━━━━
🍲 মোট মিল: ${m.totalMeal} টি
🏷️ মিল রেট: ৳ ${mealRate.toFixed(2)}
🥗 খাবারের খরচ: ৳ ${m.perMealCost.toFixed(2)}
⚡ ইউটিলিটি খরচ: ৳ ${perPersonUtilityCost.toFixed(2)}
🏠 রুম রেন্ট: ৳ ${(m.roomRent || 0).toFixed(2)}
🛒 আপনার জমা (বাজার+চাল): ৳ ${m.totalCost.toFixed(2)}
━━━━━━━━━━━━━━━━━━━
👉 আর্থিক অবস্থা:
${statusText} (প্রকৃত: ৳ ${m.rawFinancialPosition.toFixed(2)})
━━━━━━━━━━━━━━━━━━━
© মেস ম্যানেজমেন্ট সিস্টেম`;

    navigator.clipboard.writeText(slip);
    showToast(`📋 '${m.name}'-এর স্লিপ কপি হয়েছে!`);
  };

  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : ''}`}>
      {/* টোস্ট মেসেজ */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      {/* নেভিগেশন বার */}
      <header className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">🍽️</span>
          <div>
            <h1 className="brand-title">SmartMess</h1>
            <p className="brand-subtitle">মেস মিল ও বিল ক্যালকুলেটর</p>
          </div>
        </div>

        <div className="nav-actions no-print">
          <button onClick={handleLoadDemo} className="btn-secondary" title="ডেমো ডাটা লোড করুন">
            ✨ ডেমো ডাটা
          </button>
          <button onClick={() => window.print()} className="btn-secondary" title="প্রিন্ট বা PDF হিসেবে সেভ">
            🖨️ প্রিন্ট / PDF
          </button>
          <button onClick={handleResetAll} className="btn-danger-outline" title="সব মুছে নতুন করুন">
            🗑️ রিসেট
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle-btn"
            title="ডার্ক / লাইট মোড টগল"
          >
            {darkMode ? '☀️ লাইট মোড' : '🌙 ডার্ক মোড'}
          </button>
        </div>
      </header>

      <main className="container">
        {/* কেপিআই স্ট্যাটাস কার্ডস */}
        <section className="kpi-grid">
          <div className="kpi-card card-blue">
            <div className="kpi-icon">👥</div>
            <div className="kpi-info">
              <span className="kpi-label">মোট মেম্বার</span>
              <h3 className="kpi-val">{totalMembers} <span className="unit">জন</span></h3>
            </div>
          </div>

          <div className="kpi-card card-purple">
            <div className="kpi-icon">🍲</div>
            <div className="kpi-info">
              <span className="kpi-label">সর্বমোট মিল</span>
              <h3 className="kpi-val">{subTotalMeal} <span className="unit">টি</span></h3>
            </div>
          </div>

          <div className="kpi-card card-orange glow-card">
            <div className="kpi-icon">🏷️</div>
            <div className="kpi-info">
              <span className="kpi-label">বর্তমান মিল রেট</span>
              <h3 className="kpi-val highlight-val">৳ {mealRate.toFixed(2)}</h3>
            </div>
          </div>

          <div className="kpi-card card-teal">
            <div className="kpi-icon">⚡</div>
            <div className="kpi-info">
              <span className="kpi-label">মাথাপিছু ইউটিলিটি</span>
              <h3 className="kpi-val">৳ {perPersonUtilityCost.toFixed(2)}</h3>
            </div>
          </div>

          <div className="kpi-card card-green">
            <div className="kpi-icon">🛒</div>
            <div className="kpi-info">
              <span className="kpi-label">মোট মেস খরচ</span>
              <h3 className="kpi-val">৳ {grandTotalMessExpense.toFixed(2)}</h3>
            </div>
          </div>
        </section>

        {/* ফর্ম লেআউট গ্রিড */}
        <div className="forms-container no-print">
          {/* ১. মেম্বার ফর্ম */}
          <div className="glass-card">
            <div className="card-header">
              <h2>
                <span className="step-badge">১</span>
                {editingId ? 'মেম্বার তথ্য সংশোধন করুন' : 'নতুন মেম্বার যুক্ত করুন'}
              </h2>
              {editingId && (
                <button onClick={handleCancelEdit} className="btn-small-cancel">
                  বাতিল
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitMember} className="member-form">
              <div className="form-group">
                <label>👤 মেম্বারের নাম</label>
                <input
                  type="text"
                  placeholder="যেমন: মোঃ সাব্বির"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-row-grid">
                <div className="form-group">
                  <label>🛒 বাজার খরচ (৳)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="০"
                    value={bazarCost}
                    onChange={(e) => setBazarCost(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>🌾 চাল খরচ (৳)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="০"
                    value={riceCost}
                    onChange={(e) => setRiceCost(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>🍽️ মোট মিল</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="০"
                    value={totalMeal}
                    onChange={(e) => setTotalMeal(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>🏠 রুম রেন্ট (৳)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="০"
                    value={roomRent}
                    onChange={(e) => setRoomRent(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className={`btn-primary ${editingId ? 'btn-update' : ''}`}>
                {editingId ? '✓ তথ্য আপডেট করুন' : '+ মেম্বার যোগ করুন'}
              </button>
            </form>
          </div>

          {/* ২. ইউটিলিটি বিলের তথ্য */}
          <div className="glass-card">
            <div className="card-header">
              <h2>
                <span className="step-badge">২</span> ইউটিলিটি বিলের হিসাব
              </h2>
              <span className="badge-pill">মোট: ৳ {totalUtilityCost.toFixed(2)}</span>
            </div>

            <div className="utility-grid">
              <div className="form-group">
                <label>🔥 গ্যাস বিল</label>
                <input
                  type="number"
                  name="gasBill"
                  value={utility.gasBill || ''}
                  onChange={handleUtilityChange}
                  placeholder="০"
                />
              </div>

              <div className="form-group">
                <label>⚡ বিদ্যুৎ বিল</label>
                <input
                  type="number"
                  name="electricityBill"
                  value={utility.electricityBill || ''}
                  onChange={handleUtilityChange}
                  placeholder="০"
                />
              </div>

              <div className="form-group">
                <label>🛗 লিফট বিল</label>
                <input
                  type="number"
                  name="liftBill"
                  value={utility.liftBill || ''}
                  onChange={handleUtilityChange}
                  placeholder="০"
                />
              </div>

              <div className="form-group">
                <label>📶 ওয়াইফাই বিল</label>
                <input
                  type="number"
                  name="wifiBill"
                  value={utility.wifiBill || ''}
                  onChange={handleUtilityChange}
                  placeholder="০"
                />
              </div>

              <div className="form-group">
                <label>🧹 খালা/বুয়া বিল</label>
                <input
                  type="number"
                  name="khalaBill"
                  value={utility.khalaBill || ''}
                  onChange={handleUtilityChange}
                  placeholder="০"
                />
              </div>

              <div className="form-group">
                <label>🗑️ ময়লা বিল</label>
                <input
                  type="number"
                  name="garbageBill"
                  value={utility.garbageBill || ''}
                  onChange={handleUtilityChange}
                  placeholder="০"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ৩. ফলাফল সেকশন */}
        <section className="glass-card results-card">
          <div className="results-header">
            <div>
              <h2>
                <span className="step-badge">৩</span> চূড়ান্ত মেস হিসাব বিবরণী
              </h2>
              <p className="section-desc">সকল মেম্বারের খাবার ও ইউটিলিটি সমন্বয়</p>
            </div>

            <div className="table-controls no-print">
              <div className="tab-buttons">
                <button
                  className={`tab-btn ${activeTab === 'table' ? 'active' : ''}`}
                  onClick={() => setActiveTab('table')}
                >
                  📊 টেবিল ভিউ
                </button>
                <button
                  className={`tab-btn ${activeTab === 'slips' ? 'active' : ''}`}
                  onClick={() => setActiveTab('slips')}
                >
                  📱 স্লিপ ভিউ ({calculatedMembers.length})
                </button>
              </div>

              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="মেম্বারের নাম খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* সমতা ও হিসাব ব্যালেন্স বার */}
          <div className="balance-bar">
            <div className="balance-item">
              <span>মোট বাজার ও চাল জমা:</span>
              <strong>৳ {totalMealCost.toFixed(2)}</strong>
            </div>
            <div className="balance-item">
              <span>মোট মিল খরচ:</span>
              <strong>৳ {(mealRate * subTotalMeal).toFixed(2)}</strong>
            </div>
            <div className="balance-item">
              <span>পাওনাদারদের মোট পাওনা:</span>
              <strong className="text-success">৳ {totalReceivable}</strong>
            </div>
            <div className="balance-item">
              <span>দেনাদারদের মোট দেনা:</span>
              <strong className="text-danger">৳ {totalPayable}</strong>
            </div>
          </div>

          {calculatedMembers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>কোনো মেম্বার যুক্ত করা হয়নি</h3>
              <p>উপরে ফর্ম থেকে নতুন মেম্বার যোগ করুন অথবা "✨ ডেমো ডাটা" বাটনে ক্লিক করুন।</p>
            </div>
          ) : activeTab === 'table' ? (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>মেম্বার</th>
                    <th>জমা (বাজার+চাল)</th>
                    <th>মিল</th>
                    <th>মিল খরচ</th>
                    <th>খাবার + ইউটিলিটি</th>
                    <th>রুম রেন্ট</th>
                    <th>আর্থিক অবস্থান</th>
                    <th className="no-print">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => {
                    const isReceivable = m.ceilingValue >= 0;
                    return (
                      <tr key={m.id}>
                        <td>
                          <div className="member-cell">
                            <span className="member-avatar">
                              {m.name.trim().charAt(0) || 'M'}
                            </span>
                            <span className="member-name">{m.name}</span>
                          </div>
                        </td>
                        <td>
                          <strong className="num-val">৳ {m.totalCost.toFixed(2)}</strong>
                          <span className="sub-detail">
                            (বাজার: {m.bazarCost} + চাল: {m.riceCost})
                          </span>
                        </td>
                        <td>
                          <span className="badge-meal">{m.totalMeal} টি</span>
                        </td>
                        <td className="num-val">৳ {m.perMealCost.toFixed(2)}</td>
                        <td className="num-val">৳ {m.mealPlusUtility.toFixed(2)}</td>
                        <td className="num-val">৳ {(m.roomRent || 0).toFixed(2)}</td>
                        <td>
                          <div className={`status-pill ${isReceivable ? 'pill-green' : 'pill-red'}`}>
                            {isReceivable ? (
                              <span>✅ পাবে: <strong>৳ {m.ceilingValue}</strong></span>
                            ) : (
                              <span>🔻 দেবে: <strong>৳ {Math.abs(m.ceilingValue)}</strong></span>
                            )}
                          </div>
                          <span className="actual-cost">
                            (প্রকৃত: ৳ {m.rawFinancialPosition.toFixed(2)})
                          </span>
                        </td>
                        <td className="no-print actions-cell">
                          <button
                            onClick={() => handleCopySlip(m)}
                            className="btn-icon"
                            title="হোয়াটসঅ্যাপ স্লিপ কপি করুন"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => handleEdit(m)}
                            className="btn-icon btn-edit"
                            title="এডিট করুন"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleRemoveMember(m.id, m.name)}
                            className="btn-icon btn-delete"
                            title="মুছে ফেলুন"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* স্লিপ কার্ড ভিউ */
            <div className="slips-grid">
              {filteredMembers.map((m) => {
                const isReceivable = m.ceilingValue >= 0;
                return (
                  <div key={m.id} className="slip-card">
                    <div className="slip-top">
                      <div className="member-cell">
                        <span className="member-avatar">{m.name.charAt(0)}</span>
                        <div>
                          <h4 className="slip-name">{m.name}</h4>
                          <span className="badge-meal">{m.totalMeal} মিল</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopySlip(m)}
                        className="btn-copy-slip no-print"
                        title="মেসেঞ্জার বা হোয়াটসঅ্যাপে পাঠাতে কপি করুন"
                      >
                        📋 কপি
                      </button>
                    </div>

                    <div className="slip-breakdown">
                      <div className="slip-row">
                        <span>খাবারের খরচ ({m.totalMeal} × ৳{mealRate.toFixed(1)}):</span>
                        <strong>৳ {m.perMealCost.toFixed(2)}</strong>
                      </div>
                      <div className="slip-row">
                        <span>ইউটিলিটি বিল:</span>
                        <strong>৳ {perPersonUtilityCost.toFixed(2)}</strong>
                      </div>
                      <div className="slip-row">
                        <span>রুম রেন্ট:</span>
                        <strong>৳ {(m.roomRent || 0).toFixed(2)}</strong>
                      </div>
                      <div className="slip-row highlight-row">
                        <span>সর্বমোট খরচ:</span>
                        <strong>৳ {(m.mealPlusUtility + (m.roomRent || 0)).toFixed(2)}</strong>
                      </div>
                      <div className="slip-row">
                        <span>মোট জমা (বাজার+চাল):</span>
                        <strong className="text-success">৳ {m.totalCost.toFixed(2)}</strong>
                      </div>
                    </div>

                    <div className={`slip-footer ${isReceivable ? 'pill-green' : 'pill-red'}`}>
                      {isReceivable ? (
                        <span>মেস থেকে পাবেন: <strong>৳ {m.ceilingValue}</strong></span>
                      ) : (
                        <span>মেসে জমা দিতে হবে: <strong>৳ {Math.abs(m.ceilingValue)}</strong></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ফুটার */}
      <footer className="footer">
        <div className="footer-content">
          <p className="copyright">
            © {new Date().getFullYear()} <strong>SmartMess</strong> • সর্বস্বত্ব সংরক্ষিত
          </p>
          <p className="dev-credit">
            Developed with ❤️ by <strong>Md Rokibul Islam Chonchol</strong>
          </p>
          <div className="contact-links">
            <a href="tel:01522117752" className="contact-pill">
              📞 01522117752
            </a>
            <a href="mailto:mdrokibulIslam7752@gmail.com" className="contact-pill">
              ✉️ mdrokibulIslam7752@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
