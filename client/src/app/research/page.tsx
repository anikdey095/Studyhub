'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  FileText,
  Search,
  Download,
  BookOpen,
  ExternalLink,
  Plus,
  X,
  Sparkles,
  Share2,
  CheckCircle,
  GraduationCap,
  Lock,
  Upload,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuth } from '@/context/AuthContext';

interface Paper {
  id: string;
  title: string;
  abstract: string;
  field: string;
  authors: string[];
  institution: string;
  year: number;
  citations: number;
  doi: string;
  pdfUrl: string;
}

const INITIAL_PAPERS: Paper[] = [
  {
    id: 'p-1',
    title: 'Scalable Latent Diffusion Models for High-Fidelity Video Synthesis',
    abstract: 'We present an architectural improvement to temporal transformer blocks that achieves a 3.4x reduction in inference latency while preserving photorealistic spatial coherence across extended video horizons.',
    field: 'AI & Robotics',
    authors: ['Sarah Vance (PhD)', 'Prof. Michael Hastings'],
    institution: 'Stanford AI Research Lab',
    year: 2026,
    citations: 184,
    doi: '10.1145/3610548.3618192',
    pdfUrl: 'https://arxiv.org',
  },
  {
    id: 'p-2',
    title: 'Fault-Tolerant Surface Code Decoders Using Graph Neural Networks',
    abstract: 'Demonstrating sub-threshold logical error rates in topological quantum memory through real-time syndrome extraction with hardware-accelerated GNN decoders.',
    field: 'Quantum Computing',
    authors: ['Liam O’Connor', 'Dr. Aris Thorne'],
    institution: 'MIT Quantum Information Center',
    year: 2026,
    citations: 92,
    doi: '10.1038/s41586-025-07891-2',
    pdfUrl: 'https://arxiv.org',
  },
  {
    id: 'p-3',
    title: 'Targeted Epigenetic Reprogramming via CRISPR-Associated Deaminases',
    abstract: 'High-precision in vivo locus editing of methylation signatures without double-stranded DNA breaks, demonstrating therapeutic reversal of pro-inflammatory cellular states.',
    field: 'Biotechnology',
    authors: ['Claire Dumont', 'Ethan Zhou'],
    institution: 'Broad Institute of Harvard & MIT',
    year: 2025,
    citations: 240,
    doi: '10.1126/science.abm4219',
    pdfUrl: 'https://nature.com',
  },
  {
    id: 'p-4',
    title: 'Perovskite-Silicon Tandem Photovoltaics Under Accelerated Thermal Stress',
    abstract: 'Analysis of 2,000-hour continuous operation metrics showing 29.8% operational power conversion efficiency utilizing self-assembling molecular passivation layers.',
    field: 'Renewable Energy',
    authors: ['Amara Patel', 'Dr. Stefan Meyer'],
    institution: 'ETH Zürich / Energy Lab',
    year: 2025,
    citations: 115,
    doi: '10.1016/j.joule.2025.04.011',
    pdfUrl: 'https://energy.org',
  },
];

const FIELDS = ['All', 'AI & Robotics', 'Quantum Computing', 'Biotechnology', 'Renewable Energy'];

export default function ResearchPage() {
  const { user, isAuthenticated } = useAuth();
  const [papers, setPapers] = useState<Paper[]>(INITIAL_PAPERS);
  const [selectedField, setSelectedField] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [selectedReadingPaper, setSelectedReadingPaper] = useState<Paper | null>(null);

  // Sync research papers from server
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await axios.get(`${API_URL}/api/admin/research`);
        if (res.data?.papers && Array.isArray(res.data.papers) && res.data.papers.length > 0) {
          const apiIds = new Set(res.data.papers.map((p: any) => p.id));
          const uniqueInitial = INITIAL_PAPERS.filter((p) => !apiIds.has(p.id));
          setPapers([...res.data.papers, ...uniqueInitial]);
        }
      } catch (err) {
        // Use local fallback
      }
    };
    fetchPapers();
  }, []);

  // Form State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [institution, setInstitution] = useState('');
  const [field, setField] = useState('AI & Robotics');
  const [abstract, setAbstract] = useState('');
  const [doi, setDoi] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPapers = papers.filter((p) => {
    const matchesField = selectedField === 'All' || p.field === selectedField;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesField && matchesQuery;
  });

  const handleDownload = (id: string) => {
    setDownloadedId(id);
    const paper = papers.find((p) => p.id === id);

    if (paper) {
      if (
        paper.pdfUrl &&
        (paper.pdfUrl.startsWith('http://localhost') ||
          paper.pdfUrl.startsWith('/uploads') ||
          paper.pdfUrl.endsWith('.pdf')) &&
        !paper.pdfUrl.includes('arxiv.org')
      ) {
        const link = document.createElement('a');
        link.href = paper.pdfUrl;
        link.download = `${paper.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const cleanTitle = (paper.title || 'Research Preprint').replace(/[()\\\r\n]/g, '').slice(0, 50);
        const cleanAuthors = (paper.authors?.join(', ') || 'Scholars').replace(/[()\\\r\n]/g, '').slice(0, 60);
        const cleanInst = (paper.institution || 'StudyHub Academic').replace(/[()\\\r\n]/g, '');
        const cleanDoi = (paper.doi || '10.1145/studyhub.2026').replace(/[()\\\r\n]/g, '');
        const cleanAbs1 = (paper.abstract || '').replace(/[()\\\r\n]/g, '').slice(0, 75);
        const cleanAbs2 = (paper.abstract || '').replace(/[()\\\r\n]/g, '').slice(75, 150);

        const pdfContent = [
          '%PDF-1.4',
          '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
          '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
          '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj',
          '4 0 obj << /Length 520 >> stream',
          'BT',
          '/F1 20 Tf',
          '50 720 Td',
          `(${cleanTitle}) Tj`,
          '/F2 11 Tf',
          '0 -28 Td',
          `(Authors: ${cleanAuthors}) Tj`,
          '0 -18 Td',
          `(Institution: ${cleanInst} | DOI: ${cleanDoi}) Tj`,
          '0 -18 Td',
          '(StudyHub Open Preprint Archive - Peer Verified Paper) Tj',
          '/F1 13 Tf',
          '0 -35 Td',
          '(Abstract & Research Synopsis:) Tj',
          '/F2 10 Tf',
          '0 -20 Td',
          `(${cleanAbs1}) Tj`,
          '0 -16 Td',
          `(${cleanAbs2}) Tj`,
          '0 -35 Td',
          '(Downloaded via StudyHub Academic Research Repository - www.studyhub.org) Tj',
          'ET',
          'endstream',
          'endobj',
          '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
          '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
          'xref',
          '0 7',
          '0000000000 65535 f ',
          '0000000010 00000 n ',
          '0000000060 00000 n ',
          '0000000117 00000 n ',
          '0000000244 00000 n ',
          '0000000820 00000 n ',
          '0000000890 00000 n ',
          'trailer << /Size 7 /Root 1 0 R >>',
          'startxref',
          '955',
          '%%EOF',
        ].join('\n');

        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${paper.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_StudyHub_Preprint.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }
    }

    setTimeout(() => setDownloadedId(null), 2500);
  };

  const handleAddPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalPdfUrl = pdfUrl || 'https://arxiv.org';
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await axios.post(`${API_URL}/api/notes/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes.data?.file?.fileUrl) {
          finalPdfUrl = `${API_URL}${uploadRes.data.file.fileUrl}`;
        }
      } catch (err) {
        console.warn('Research PDF upload notice:', err);
      }
    }

    const newPaperData = {
      title,
      abstract,
      field,
      authors: authors.split(',').map((a) => a.trim()).filter(Boolean),
      institution: institution || 'Independent Academic',
      year: 2026,
      citations: 1,
      doi: doi || `10.1145/studyhub.${Date.now().toString().slice(-6)}`,
      pdfUrl: finalPdfUrl,
    };

    try {
      const res = await axios.post(`${API_URL}/api/admin/research`, newPaperData);
      if (res.data?.paper) {
        setPapers([res.data.paper, ...papers]);
      } else {
        const fallbackPaper: Paper = { id: `p-${Date.now()}`, ...newPaperData };
        setPapers([fallbackPaper, ...papers]);
      }
    } catch {
      const fallbackPaper: Paper = { id: `p-${Date.now()}`, ...newPaperData };
      setPapers([fallbackPaper, ...papers]);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    setTitle('');
    setAuthors('');
    setInstitution('');
    setAbstract('');
    setDoi('');
    setPdfUrl('');
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
              <FileText className="w-4 h-4" />
              <span>Open Science & Publications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Research Papers & Preprints</h1>
            <p className="text-sm text-gray-400 mt-1">
              Explore cutting-edge undergraduate thesis projects, graduate publications, and lab findings.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                setShowAuthGate(true);
              } else {
                setIsModalOpen(true);
              }
            }}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Research Paper</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="my-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research by title, keyword, methodology, or institution..."
              className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {FIELDS.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedField(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedField === f
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-600/20'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Papers List */}
        <div className="space-y-6">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/30 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30">
                    {paper.field}
                  </span>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <span>Published {paper.year}</span>
                    <span>•</span>
                    <span className="text-purple-300 font-medium">{paper.citations} Citations</span>
                  </div>
                </div>

                <h3
                  onClick={() => setSelectedReadingPaper(paper)}
                  className="text-xl font-bold text-white hover:text-pink-300 transition-colors cursor-pointer"
                  title="Click to view & read preprint"
                >
                  {paper.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 mt-2">
                  <span className="font-semibold text-gray-200">
                    {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{paper.institution}</span>
                </div>

                <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                  {paper.abstract}
                </p>

                <div className="mt-4 text-xs font-mono text-gray-500">
                  DOI: <span className="text-gray-400">{paper.doi}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedReadingPaper(paper)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 transition-all shadow-sm"
                    title="Read academic preprint"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Paper</span>
                  </button>

                  <a
                    href={paper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 font-medium transition-colors"
                  >
                    <span>Journal / ArXiv</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>

                <button
                  onClick={() => handleDownload(paper.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    downloadedId === paper.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10'
                  }`}
                  title="Download manuscript PDF"
                >
                  {downloadedId === paper.id ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Saved PDF</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0f0f18] border border-white/15 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Submit Research Paper</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPaper} className="space-y-4 mt-4">
                <InputField
                  id="paper-title"
                  name="title"
                  label="Paper Title"
                  placeholder="e.g. Novel Approaches in Graph Transformers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <InputField
                  id="paper-authors"
                  name="authors"
                  label="Authors (comma separated)"
                  placeholder="e.g. Sarah Vance, Prof. Michael Hastings"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    id="paper-institution"
                    name="institution"
                    label="Institution / University"
                    placeholder="e.g. Stanford University"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Field</label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {FIELDS.filter((f) => f !== 'All').map((f) => (
                        <option key={f} value={f} className="bg-[#0f0f18]">
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Abstract</label>
                  <textarea
                    rows={3}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    placeholder="Brief description of findings, methodology, and results..."
                    className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                {/* Device Paper PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                    <span>Upload Preprint Manuscript PDF</span>
                    <span className="text-[11px] text-pink-400 font-semibold">Device PDF</span>
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-500/40 hover:border-pink-500/80 bg-purple-500/[0.03] hover:bg-pink-500/[0.06] rounded-xl p-3.5 text-center cursor-pointer transition-all"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <div className="flex items-center justify-between bg-white/[0.06] border border-white/10 rounded-xl p-2.5 text-left">
                        <div className="flex items-center space-x-3 truncate">
                          <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs shrink-0">
                            PDF
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-white truncate">{selectedFile.name}</p>
                            <p className="text-[11px] text-emerald-400">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Manuscript Attached
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="p-1 text-gray-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2 py-1 text-gray-400 hover:text-white">
                        <Upload className="w-4 h-4 text-pink-400" />
                        <span className="text-xs font-medium">Click to select PDF paper from your computer</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                  <Button type="submit" isLoading={isSubmitting} className="w-auto px-6">
                    Publish Preprint
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Research Paper Academic Reader Modal */}
        {selectedReadingPaper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-4xl max-h-[92vh] bg-[#0d0d15] border border-white/20 rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-white/10 bg-white/[0.02] flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-pink-500/20 text-pink-300 font-semibold text-xs border border-pink-500/30">
                      {selectedReadingPaper.field}
                    </span>
                    <span className="text-xs text-gray-400">Published {selectedReadingPaper.year}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-purple-300 font-semibold">{selectedReadingPaper.citations} Citations</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {selectedReadingPaper.title}
                  </h2>
                  <p className="text-xs text-gray-300 mt-1.5">
                    Authors:{' '}
                    <span className="text-white font-medium">
                      {Array.isArray(selectedReadingPaper.authors)
                        ? selectedReadingPaper.authors.join(', ')
                        : selectedReadingPaper.authors}
                    </span>{' '}
                    • <span className="text-gray-400">{selectedReadingPaper.institution}</span>
                  </p>
                  <p className="text-[11px] font-mono text-gray-500 mt-1">DOI: {selectedReadingPaper.doi}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleDownload(selectedReadingPaper.id)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-pink-600/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedReadingPaper(null)}
                    className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Reader Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
                {/* Abstract Section */}
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Abstract & Research Synopsis</span>
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed pt-1">
                    {selectedReadingPaper.abstract}
                  </p>
                </div>

                {/* PDF Manuscript Viewer / Interactive Reader Canvas */}
                {selectedReadingPaper.pdfUrl &&
                (selectedReadingPaper.pdfUrl.startsWith('http://localhost') ||
                  selectedReadingPaper.pdfUrl.startsWith('/uploads') ||
                  selectedReadingPaper.pdfUrl.endsWith('.pdf')) &&
                !selectedReadingPaper.pdfUrl.includes('arxiv.org') &&
                !selectedReadingPaper.pdfUrl.includes('nature.com') ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="font-semibold text-gray-300">Manuscript Preview</span>
                      <a
                        href={selectedReadingPaper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300 flex items-center space-x-1"
                      >
                        <span>Open Full Screen</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <iframe
                      src={selectedReadingPaper.pdfUrl}
                      className="w-full h-[55vh] rounded-xl border border-white/15 bg-white shadow-xl"
                      title={selectedReadingPaper.title}
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-gray-400">
                      <span className="text-pink-400 font-semibold">Open Science Preprint Archive</span>
                      <span className="font-mono">{selectedReadingPaper.doi}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                        <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                          🔬 Methodology & Novel Contributions
                        </h5>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          This work investigates scalable architectures, algorithmic refinements, and empirical validations in{' '}
                          <span className="text-pink-300 font-semibold">{selectedReadingPaper.field}</span>, addressing existing bottlenecks in computational throughput and theoretical accuracy.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                        <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                          📊 Citation & Verification
                        </h5>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Indexed with {selectedReadingPaper.citations} academic citations. Formatted for citation in BibTeX, APA 7th Edition, and IEEE styles.
                        </p>
                        <div className="pt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
                            <CheckCircle className="w-3 h-3 mr-1" /> Peer Reviewed Preprint
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <a
                        href={selectedReadingPaper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-pink-400 hover:text-pink-300 flex items-center space-x-1"
                      >
                        <span>Visit Publisher Repository</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>

                      <button
                        onClick={() => handleDownload(selectedReadingPaper.id)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Preprint PDF</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Auth Gate Modal for Research Submission */}
        {showAuthGate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0f0f18] border border-purple-500/30 rounded-2xl p-6 shadow-2xl text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-pink-600/30">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Login or Sign Up Required</h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                Publishing preprints and academic research papers requires a verified researcher or student account. Please sign in or register to publish your paper.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/login"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-semibold text-center transition-all shadow-md shadow-pink-600/20"
                >
                  Sign In to StudyHub
                </Link>
                <Link
                  href="/signup"
                  className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-semibold text-center transition-all border border-white/10"
                >
                  Create Researcher Account
                </Link>
                <button
                  onClick={() => setShowAuthGate(false)}
                  className="text-xs text-gray-500 hover:text-gray-300 mt-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}