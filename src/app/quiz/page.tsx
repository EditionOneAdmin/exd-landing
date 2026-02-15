'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';

interface Question {
  question: string;
  options: string[];
  correct: number;
  funFact: string;
  sparkData: number[];
  sparkLabel: string;
}

const questions: Question[] = [
  {
    question: 'Which country has the highest GDP (nominal) in 2024?',
    options: ['China', 'United States', 'Japan', 'Germany'],
    correct: 1,
    funFact: 'The US GDP exceeds $28 trillion — larger than the next 3 economies combined.',
    sparkData: [14.7, 15.5, 16.8, 17.5, 18.2, 19.5, 20.5, 21.1, 20.9, 23.0, 25.5, 27.4, 28.8],
    sparkLabel: 'US GDP (trillions $), 2012–2024',
  },
  {
    question: 'What is the approximate world population in 2024?',
    options: ['6.5 billion', '7.2 billion', '8.1 billion', '9.0 billion'],
    correct: 2,
    funFact: 'India surpassed China as the most populous country in 2023.',
    sparkData: [6.1, 6.5, 6.9, 7.0, 7.2, 7.4, 7.6, 7.8, 7.9, 8.0, 8.1],
    sparkLabel: 'World population (billions), 2000–2024',
  },
  {
    question: 'Which country emits the most CO₂ annually?',
    options: ['United States', 'India', 'Russia', 'China'],
    correct: 3,
    funFact: 'China emits more CO₂ than the US and EU combined — over 12 billion tonnes/year.',
    sparkData: [3.4, 4.1, 5.1, 6.2, 7.2, 8.1, 9.0, 9.8, 10.1, 10.7, 11.4, 12.1],
    sparkLabel: 'China CO₂ (Gt), 2000–2023',
  },
  {
    question: 'What is the global average life expectancy in 2024?',
    options: ['62 years', '67 years', '73 years', '78 years'],
    correct: 2,
    funFact: 'Life expectancy has increased by over 25 years since 1950 — mostly due to child mortality reduction.',
    sparkData: [47, 50, 53, 56, 59, 61, 64, 66, 68, 70, 71, 72, 72.5, 73],
    sparkLabel: 'Global life expectancy, 1950–2024',
  },
  {
    question: 'What percentage of the world has internet access?',
    options: ['45%', '55%', '67%', '78%'],
    correct: 2,
    funFact: 'In 2000 only 6.5% of the world was online. Growth has been exponential.',
    sparkData: [6.5, 10, 16, 21, 26, 30, 35, 39, 43, 49, 54, 58, 62, 67],
    sparkLabel: 'Internet penetration (%), 2000–2024',
  },
  {
    question: 'Which renewable energy source generates the most electricity globally?',
    options: ['Solar', 'Wind', 'Hydropower', 'Geothermal'],
    correct: 2,
    funFact: 'Hydropower generates ~4,300 TWh/year — more than solar and wind combined (though they\'re catching up fast).',
    sparkData: [2700, 2800, 2900, 3100, 3300, 3500, 3700, 3900, 4000, 4100, 4200, 4300],
    sparkLabel: 'Hydro generation (TWh), 2012–2023',
  },
  {
    question: 'What is the global literacy rate?',
    options: ['72%', '80%', '87%', '93%'],
    correct: 2,
    funFact: '200 years ago, only 12% of the world could read. Education is humanity\'s greatest quiet revolution.',
    sparkData: [12, 21, 32, 42, 56, 65, 73, 80, 83, 85, 86, 87],
    sparkLabel: 'Global literacy (%), 1800–2024',
  },
  {
    question: 'How many people live in extreme poverty (under $2.15/day)?',
    options: ['~350 million', '~650 million', '~1.2 billion', '~2 billion'],
    correct: 1,
    funFact: 'In 1990, 1.9 billion people lived in extreme poverty. The decline is one of humanity\'s greatest achievements.',
    sparkData: [1900, 1800, 1700, 1500, 1300, 1100, 900, 800, 740, 700, 650],
    sparkLabel: 'Extreme poverty (millions), 1990–2024',
  },
  {
    question: 'Which city has the most expensive real estate per square meter?',
    options: ['New York', 'Monaco', 'Hong Kong', 'London'],
    correct: 1,
    funFact: 'Monaco averages $53,000/m² — a modest apartment can cost over $10 million.',
    sparkData: [28, 31, 35, 38, 41, 44, 47, 48, 50, 51, 53],
    sparkLabel: 'Monaco price (k$/m²), 2014–2024',
  },
  {
    question: 'What share of global energy comes from fossil fuels?',
    options: ['60%', '72%', '80%', '88%'],
    correct: 2,
    funFact: 'Despite the renewables boom, fossil fuels still dominate — though their share has been slowly declining since 2019.',
    sparkData: [87, 87, 86, 86, 86, 85, 85, 84, 84, 83, 82, 81, 80],
    sparkLabel: 'Fossil fuel share (%), 2012–2024',
  },
];

function Sparkline({ data, correct }: { data: number[]; correct: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = 200, h = 50, m = 4;
    const x = d3.scaleLinear().domain([0, data.length - 1]).range([m, w - m]);
    const y = d3.scaleLinear().domain(d3.extent(data) as [number, number]).range([h - m, m]);

    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveCatmullRom);

    const gradId = `grad-${Math.random().toString(36).slice(2)}`;
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', gradId).attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
    const color = correct ? '#818cf8' : '#f87171';
    grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.3);
    grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);

    const area = d3.area<number>()
      .x((_, i) => x(i))
      .y0(h)
      .y1(d => y(d))
      .curve(d3.curveCatmullRom);

    svg.append('path').datum(data).attr('d', area).attr('fill', `url(#${gradId})`);
    svg.append('path').datum(data).attr('d', line).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2);
    svg.append('circle').attr('cx', x(data.length - 1)).attr('cy', y(data[data.length - 1])).attr('r', 3).attr('fill', color);
  }, [data, correct]);

  return <svg ref={svgRef} viewBox="0 0 200 50" className="w-full h-12" />;
}

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  const q = questions[current];
  const isAnswered = selected !== null;
  const isCorrect = selected === q.correct;
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  const handleSelect = useCallback((idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }, [isAnswered, answers, current]);

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setFinished(false);
  };

  const shareText = `I scored ${score}/${questions.length} on the EXD World Data Quiz! 🌍📊 Can you beat me?`;

  const handleCopyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const progress = finished ? 100 : ((current + (isAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-[#050507] text-white pt-24 pb-16 px-4">
      {/* Progress Bar */}
      <div className="fixed top-[57px] left-0 right-0 z-40 h-1 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              World Data Quiz
            </span>
          </h1>
          <p className="text-white/50 text-sm">How well do you know the numbers behind our world?</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question Counter */}
              <div className="flex justify-between items-center mb-4 text-xs text-white/40">
                <span>Question {current + 1} of {questions.length}</span>
                <span>{score} correct so far</span>
              </div>

              {/* Question Card */}
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 shadow-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

                <h2 className="text-lg md:text-xl font-semibold mb-6 relative">{q.question}</h2>

                <div className="space-y-3 relative">
                  {q.options.map((opt, i) => {
                    let borderColor = 'border-white/10 hover:border-white/20';
                    let bg = 'bg-white/[0.02]';
                    if (isAnswered) {
                      if (i === q.correct) {
                        borderColor = 'border-emerald-500/60';
                        bg = 'bg-emerald-500/10';
                      } else if (i === selected && i !== q.correct) {
                        borderColor = 'border-red-500/60';
                        bg = 'bg-red-500/10';
                      }
                    }
                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={isAnswered}
                        whileHover={!isAnswered ? { scale: 1.01 } : {}}
                        whileTap={!isAnswered ? { scale: 0.99 } : {}}
                        className={`w-full text-left px-5 py-3.5 rounded-xl border ${borderColor} ${bg} transition-colors text-sm md:text-base ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <span className="text-white/40 mr-3 font-mono text-xs">{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Fun Fact + Sparkline */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mt-6 overflow-hidden"
                    >
                      <div className={`rounded-xl border p-4 ${isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-white/50">
                          {isCorrect ? '✅ Correct!' : '❌ Not quite'}
                        </p>
                        <p className="text-sm text-white/70 mb-3">{q.funFact}</p>
                        <div className="mt-2">
                          <p className="text-[10px] text-white/30 mb-1">{q.sparkLabel}</p>
                          <Sparkline data={q.sparkData} correct={isCorrect} />
                        </div>
                      </div>

                      <motion.button
                        onClick={handleNext}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all"
                      >
                        {current < questions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* Results */
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 shadow-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    {score >= 8 ? '🏆' : score >= 5 ? '🎯' : '📚'}
                  </motion.div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                      {score}/{questions.length}
                    </span>
                  </h2>
                  <p className="text-white/50 mb-6">
                    {score >= 8 ? 'Data genius! You really know your numbers.' : score >= 5 ? 'Not bad! You know more than most.' : 'Keep exploring — there\'s a whole world of data out there!'}
                  </p>

                  <div className="bg-white/[0.04] rounded-xl p-4 mb-6 text-sm text-white/60 italic">
                    &quot;{shareText}&quot;
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                      onClick={handleCopyLink}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all"
                    >
                      {copied ? '✅ Copied!' : '🔗 Challenge your friends'}
                    </motion.button>
                    <motion.button
                      onClick={handleRestart}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium hover:bg-white/[0.06] transition-all"
                    >
                      🔄 Try Again
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
