'use client'

import {
  FileText, Newspaper, LayoutTemplate, ShoppingBag, Heading, AlignLeft,
  Link as LinkIcon, HelpCircle, Mail, Facebook, Instagram, Linkedin, Twitter,
  Youtube, Megaphone, MessageSquare, Wand2, Gauge, Search, RefreshCw,
  History, Download, Moon, Sparkles, LayoutDashboard, Settings, CheckCheck,
  Minimize2, Maximize2, Briefcase, Smile, Feather, Zap, Star, TrendingUp,
  Target, PenTool, Bot, Brain, Clock, BarChart3, Languages, Bookmark,
  Copy, Share2, Trash2, Pencil, Pin, Plus, Send, ArrowRight, ArrowLeft,
  Menu, X, ChevronRight, ChevronDown, ChevronLeft, Check, AlertCircle,
  Loader2, ThumbsUp, Eye, Globe, Hash, Type, ListChecks, FileCode, Rocket,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  FileText, Newspaper, LayoutTemplate, ShoppingBag, Heading, AlignLeft,
  Link: LinkIcon, HelpCircle, Mail, Facebook, Instagram, Linkedin, Twitter,
  Youtube, Megaphone, MessageSquare, Wand2, Gauge, Search, RefreshCw,
  History, Download, Moon, Sparkles, LayoutDashboard, Settings, CheckCheck,
  Minimize2, Maximize2, Briefcase, Smile, Feather, Zap, Star, TrendingUp,
  Target, PenTool, Bot, Brain, Clock, BarChart3, Languages, Bookmark,
  Copy, Share2, Trash2, Pencil, Pin, Plus, Send, ArrowRight, ArrowLeft,
  Menu, X, ChevronRight, ChevronDown, ChevronLeft, Check, AlertCircle,
  Loader2, ThumbsUp, Eye, Globe, Hash, Type, ListChecks, FileCode, Rocket,
}

interface ToolIconProps {
  name: string
  className?: string
}

export function ToolIcon({ name, className }: ToolIconProps) {
  const Icon = ICON_MAP[name] || Sparkles
  return <Icon className={className} />
}
