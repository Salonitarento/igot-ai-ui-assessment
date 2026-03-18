import React from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const helpData = [
    {
        title: "Getting Started",
        content:
            "Use the iGOT AI Assessment Generator to create curriculum-aligned assessments. Start by selecting an assessment type, then add your content, configure question settings, and generate."
    },
    {
        title: "Assessment Types",
        list: [
            "Practice – Low-stakes practice and revision",
            "Final Assessment – Summative evaluation",
            "Comprehensive – Multi-course combined assessment",
            "Competency-Based – Aligned to KCM competencies"
        ]
    },
    {
        title: "Content Input",
        content:
            "Select courses, add topics (type and press Enter or comma to add), upload transcripts or materials, and optionally add notes for AI context."
    },
    {
        title: "Configuration",
        content:
            "Choose question types (MCQ, True/False, Fill in the Blanks, etc.), set difficulty level, configure Bloom's Taxonomy distribution, and set a time limit."
    },
    {
        title: "Bloom's Taxonomy",
        list: [
            "Remember – Recall facts",
            "Understand – Explain concepts",
            "Apply – Use in new situations",
            "Analyze – Break down information",
            "Evaluate – Justify decisions",
            "Create – Produce new work"
        ]
    },
    {
        title: "Results & Export",
        content:
            "Review generated questions, edit them inline, and export as PDF, Word, or JSON. All assessments are saved and accessible from Past Assessments."
    },
    {
        title: "Past Assessments",
        content:
            "Access previously generated assessments from the Past Assessments tab. View, review, and download any assessment you've created."
    }
];

const HelpDrawer = ({ open, onClose }) => {

    return (
        <Drawer
            open={open}
            onClose={onClose}
            direction="right"
            size={420}
            duration={350}
        >
            <div className="h-full flex flex-col bg-white">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-lg font-semibold">Help & Documentation</h2>

                    <button onClick={onClose} type="button" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg><span className="sr-only">Close</span></button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 text-sm text-muted-foreground overflow-y-auto">

                    {helpData.map((section, index) => (
                        <div key={index}>
                            <h3 className="text-sm font-semibold text-foreground">
                                {section.title}
                            </h3>

                            {section.content && <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{section.content}</p>}
                            {section.list && (
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {section.list.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                </div>
            </div>
        </Drawer>
    );
};

export default HelpDrawer;