'use server';

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the data directory
const DATA_DIR = path.join(process.cwd(), 'data');
const EXPERIENCES_FILE = path.join(DATA_DIR, 'experiences.json');

// Initialize experiences file if it doesn't exist
// Moved to a function to ensure it's only called on the server

// Types
export interface Experience {
  id: string;
  message: string;
  musicUrl: string;
  photos: string[];
  backgroundPhotos?: string[];
  createdAt: string;
  createdBy: string;
  title: string;
}

// Helper functions
function readExperiences(): Experience[] {
  // Ensure initialization is done before reading
  initializeDataDirectory(); 
  const data = fs.readFileSync(EXPERIENCES_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeExperiences(experiences: Experience[]) {
  fs.writeFileSync(EXPERIENCES_FILE, JSON.stringify(experiences, null, 2));
}

// New function to initialize data directory and experiences file
function initializeDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(EXPERIENCES_FILE)) {
    fs.writeFileSync(EXPERIENCES_FILE, JSON.stringify([]));
  }
}

// Main functions
export async function createExperience(experience: Omit<Experience, 'id' | 'createdAt'>): Promise<string> {
  initializeDataDirectory(); // Ensure initialization on first call
  const experiences = readExperiences();
  const id = uuidv4();
  
  const newExperience: Experience = {
    ...experience,
    id,
    createdAt: new Date().toISOString(),
  };
  
  experiences.push(newExperience);
  writeExperiences(experiences);
  
  return id;
}

export async function getExperience(id: string): Promise<Experience | null> {
  initializeDataDirectory(); // Ensure initialization on first call
  const experiences = readExperiences();
  return experiences.find(exp => exp.id === id) || null;
}

export async function uploadPhoto(file: File): Promise<string> {
  initializeDataDirectory(); // Ensure initialization on first call
  const buffer = await file.arrayBuffer();
  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = path.join(DATA_DIR, 'photos', fileName);
  
  // Ensure photos directory exists
  const photosDir = path.join(DATA_DIR, 'photos');
  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
  }
  
  // Save file
  fs.writeFileSync(filePath, new Uint8Array(buffer));
  
  // Return the relative path
  return `/api/photos/${fileName}`;
} 