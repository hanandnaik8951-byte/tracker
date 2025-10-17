import React from 'react';

const iconProps = {
  className: "w-5 h-5 inline-block",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round",
};

export const PlusIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={`${iconProps.className} ${className}`}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
export const CameraIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={`${iconProps.className} ${className}`}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
export const TrashIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={`${iconProps.className} ${className}`}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
export const EditIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={`${iconProps.className} ${className}`}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
export const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={`${iconProps.className} ${className}`}><polyline points="6 9 12 15 18 9"></polyline></svg>;
export const ChevronUpIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={`${iconProps.className} ${className}`}><polyline points="18 15 12 9 6 15"></polyline></svg>;
export const LoaderIcon: React.FC<{className?: string}> = ({ className }) => <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
