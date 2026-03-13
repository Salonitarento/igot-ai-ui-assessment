import React from "react";

const PastAssessmentsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Past Assessments</h1>

      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground">
          Here you will see all your previously generated assessments.
        </p>
      </div>
    </div>
  );
};

export default PastAssessmentsPage;