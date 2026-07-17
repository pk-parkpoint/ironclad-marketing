"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { DataDeskChoice, DataDeskExperience, DataDeskResult, DataDeskStatus } from "@/content/data-desk";
import { DataDeskFreezeGauge } from "./data-desk-freeze-gauge";
import { DataDeskResultCard } from "./data-desk-result-card";

const gallons = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

function leakResult(dripsPerMinute: number): DataDeskResult {
  const annualGallons = Math.max(0, dripsPerMinute) * 34.71;
  const monthlyGallons = annualGallons / 12;
  const annualCost = annualGallons * 0.0126;
  const monthlyCost = annualCost / 12;
  const status: DataDeskStatus = monthlyCost >= 20 ? "high" : monthlyCost >= 5 ? "moderate" : "low";
  const tag = status === "high" ? "Significant" : status === "moderate" ? "Worth fixing" : "Minor";
  return {
    title: `${gallons.format(dripsPerMinute)} drips per minute`, tag, status,
    values: [`${gallons.format(monthlyGallons)} gallons`, `${gallons.format(annualGallons)} gallons`, dollars.format(monthlyCost), dollars.format(annualCost)],
    note: "Uses ~0.25 mL per drip, 34.71 gallons/year per drip-per-minute and a $0.0126/gallon blended rate. Confirm with a meter test.",
  };
}

function heaterResult(year: number, systemType: string): DataDeskResult {
  const currentYear = new Date().getFullYear();
  const safeYear = Math.min(currentYear, Math.max(1950, year || currentYear));
  const age = currentYear - safeYear;
  const life = systemType === "Tankless" ? [15, 20] : systemType === "Heat pump" ? [10, 15] : [8, 12];
  let status: DataDeskStatus = "low";
  let recommendation = "Healthy range · maintain and plan ahead";
  if (age > life[1]) { status = "severe"; recommendation = "Past typical life · plan replacement now"; }
  else if (age >= life[0]) { status = "high"; recommendation = "Replacement window · compare options soon"; }
  else if (age >= life[0] - 2) { status = "moderate"; recommendation = "Approaching range · build a replacement plan"; }
  return {
    title: `${safeYear} ${systemType.toLowerCase()} system`,
    tag: status === "severe" ? "Replace now" : status === "high" ? "Replace soon" : status === "moderate" ? "Plan" : "Healthy",
    status,
    values: [`${age} years`, systemType, `${life[0]}–${life[1]} years`, recommendation],
    note: "Service-life ranges are planning context. Confirm the exact manufacture / installation date and on-site condition.",
  };
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function ChoiceButtons({ options, selectedKey, onSelect }: { options: DataDeskChoice[]; selectedKey: string; onSelect: (key: string) => void }) {
  return (
    <div className="dd-chips" role="group">
      {options.map((option) => (
        <button aria-pressed={selectedKey === option.key} className={selectedKey === option.key ? "is-selected" : ""} key={option.key} onClick={() => onSelect(option.key)} type="button">
          <i aria-hidden="true" />{option.label}
        </button>
      ))}
    </div>
  );
}

export function DataDeskTool({ experience, phoneHref }: { experience: DataDeskExperience; phoneHref: string }) {
  const control = experience.control;
  const choiceOptions = control.type === "picker" || control.type === "select" || control.type === "gauge" ? control.options : [];
  const [selectedKey, setSelectedKey] = useState(choiceOptions[0]?.key ?? "");
  const [query, setQuery] = useState(control.type === "search" ? control.samples[0]?.label ?? "" : "");
  const [searchResult, setSearchResult] = useState<DataDeskResult | null>(control.type === "search" ? control.samples[0]?.result ?? control.fallback : null);
  const [searching, setSearching] = useState(false);
  const [drips, setDrips] = useState(control.type === "leak-calculator" ? control.defaultValue : 0);
  const [heaterYear, setHeaterYear] = useState(control.type === "heater-calculator" ? control.defaultYear : new Date().getFullYear());
  const [heaterType, setHeaterType] = useState(control.type === "heater-calculator" ? control.systemTypes[0] : "Tank");
  const searchTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (searchTimer.current !== undefined) window.clearTimeout(searchTimer.current);
  }, []);

  const selectedChoice = choiceOptions.find((option) => option.key === selectedKey) ?? choiceOptions[0];
  const calculatedResult = useMemo(() => {
    if (control.type === "leak-calculator") return leakResult(drips);
    if (control.type === "heater-calculator") return heaterResult(heaterYear, heaterType);
    return null;
  }, [control.type, drips, heaterType, heaterYear]);

  function submitSearch(value: string) {
    if (control.type !== "search") return;
    const lookup = normalize(value);
    setSearching(true);
    if (searchTimer.current !== undefined) window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => {
      const match = control.samples.find((sample) => {
        const sampleKey = normalize(sample.label);
        return lookup.length > 0 && (sampleKey.includes(lookup) || lookup.includes(sampleKey));
      });
      setSearchResult(match?.result ?? { ...control.fallback, title: value.trim() || control.fallback.title });
      setSearching(false);
      searchTimer.current = undefined;
    }, 850);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitSearch(query);
  }

  return (
    <section className="dd-tool-section" id="try-it">
      <div className="dd-container">
        <div className="dd-section-heading" data-reveal>
          <p>Try it</p>
          <h2>Explore the interactive preview.</h2>
          <span>Every route ships with a populated default state. Choose another input to update the documented result instantly.</span>
        </div>
        <div className="dd-control-card ic-glass" data-reveal>
          <label className="dd-control-label">{control.label}</label>
          {control.type === "select" ? (
            <div className="dd-select-wrap"><select aria-label={control.label} onChange={(event) => setSelectedKey(event.target.value)} value={selectedKey}>{control.options.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}</select></div>
          ) : null}
          {control.type === "picker" || control.type === "gauge" ? <ChoiceButtons onSelect={setSelectedKey} options={control.options} selectedKey={selectedKey} /> : null}
          {control.type === "search" ? (
            <form onSubmit={handleSearch}>
              <div className="dd-search-box"><Search aria-hidden="true" size={19} /><input aria-label={control.label} onInput={(event) => setQuery(event.currentTarget.value)} placeholder={control.placeholder} value={query} /><button className="dd-green-button" disabled={searching} type="submit">Search</button></div>
              <div className="dd-samples"><span>Try a sample:</span>{control.samples.map((sample) => <button key={sample.key} onClick={() => { setQuery(sample.label); submitSearch(sample.label); }} type="button">{sample.label}</button>)}</div>
            </form>
          ) : null}
          {control.type === "leak-calculator" ? (
            <div className="dd-calculator"><div><input aria-label={control.label} min="0" onInput={(event) => setDrips(Number(event.currentTarget.value))} type="number" value={drips} /><span>drips / minute</span></div><div className="dd-chips">{control.presets.map((preset) => <button className={drips === preset.value ? "is-selected" : ""} key={preset.value} onClick={() => setDrips(preset.value)} type="button"><i />{preset.label} · {preset.value}</button>)}</div></div>
          ) : null}
          {control.type === "heater-calculator" ? (
            <div className="dd-calculator"><div><input aria-label="Installation year" max={new Date().getFullYear()} min="1950" onInput={(event) => setHeaterYear(Number(event.currentTarget.value))} type="number" value={heaterYear} /><span>installation year</span></div><div className="dd-chips">{control.systemTypes.map((type) => <button className={heaterType === type ? "is-selected" : ""} key={type} onClick={() => setHeaterType(type)} type="button"><i />{type}</button>)}</div></div>
          ) : null}
        </div>
        {searching ? <div aria-live="polite" className="dd-searching"><span className="dd-spinner" />Checking records for {query}…</div> : null}
        {!searching && control.type === "search" && searchResult ? <DataDeskResultCard phoneHref={phoneHref} result={searchResult} rowLabels={experience.rowLabels} /> : null}
        {control.type === "gauge" && selectedChoice ? <DataDeskFreezeGauge phoneHref={phoneHref} result={selectedChoice.result} /> : null}
        {(control.type === "picker" || control.type === "select") && selectedChoice ? <DataDeskResultCard phoneHref={phoneHref} result={selectedChoice.result} rowLabels={experience.rowLabels} /> : null}
        {calculatedResult ? <DataDeskResultCard phoneHref={phoneHref} result={calculatedResult} rowLabels={experience.rowLabels} /> : null}
      </div>
    </section>
  );
}
