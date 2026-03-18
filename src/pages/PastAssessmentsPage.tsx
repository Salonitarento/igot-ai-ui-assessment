import { useState, useMemo } from "react";

import {
  Search,
  Calendar,
  Eye,
  ChevronRight,
  Plus,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const assessments = [
  {
    id: 1,
    code: "ASM-MMSTNMSB-8V7N",
    type: "Practice",
    course: "CS101",
    date: "16 Mar 2026",
    time: "12:18 pm",
    lang: "English",
    qs: 15,
    level: "Intermediate"
  },
  {
    id: 2,
    code: "ASM-MMSS5EB0-BX7G",
    type: "Competency",
    course: "—",
    date: "16 Mar 2026",
    time: "11:35 am",
    lang: "English",
    qs: 15,
    level: "Intermediate"
  },
  {
    id: 3,
    code: "ASM-MMSRZ7YV-NXEG",
    type: "Practice",
    course: "CS201",
    date: "16 Mar 2026",
    time: "11:31 am",
    lang: "English",
    qs: 18,
    level: "Intermediate"
  },
  {
    id: 4,
    code: "ASM-MMSRTRWH-05HR",
    type: "Practice",
    course: "CS201",
    date: "16 Mar 2026",
    time: "11:26 am",
    lang: "English",
    qs: 15,
    level: "Intermediate"
  }
];

const PastAssessmentsPage =() => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return assessments.filter((a) =>
      a.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="container mx-auto lg:px-4 md:px-2 sm:px-1 py-6 max-w-4xl">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Past Assessments
          </h1>

          <p className="text-sm text-muted-foreground">
            {assessments.length} assessments generated
          </p>
        </div>

        <Button className="flex gap-2">
          <Plus size={18} />
          New Assessment
        </Button>

      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />

        <Input
          className="pl-10"
          placeholder="Search by ID, course, or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              All Types
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-40">
            <div className="flex flex-col gap-2">
              <Button variant="ghost">Practice</Button>
              <Button variant="ghost">Competency</Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              All Levels
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-40">
            <div className="flex flex-col gap-2">
              <Button variant="ghost">Beginner</Button>
              <Button variant="ghost">Intermediate</Button>
              <Button variant="ghost">Advanced</Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="outline" className="gap-2">
          <Calendar size={16} />
          From date
        </Button>

        <Button variant="outline" className="gap-2">
          <Calendar size={16} />
          To date
        </Button>

      </div>

      {/* Table Header */}
      <div className="grid grid-cols-7 text-sm text-muted-foreground font-medium mb-2 px-3">
        <div className="col-span-2">ASSESSMENT</div>
        <div>COURSE</div>
        <div>DATE & TIME</div>
        <div>LANG</div>
        <div>QS</div>
        <div>ACTION</div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">

        {filtered.map((a, index) => (
          <div
            key={a.id}
            className="grid grid-cols-7 items-center bg-white border rounded-xl p-4 hover:shadow-sm transition"
          >

            {/* Assessment */}
            <div className="col-span-2 flex items-center gap-3">

              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center font-semibold">
                {index + 1}
              </div>

              <div>
                <div className="font-semibold">
                  {a.code}
                </div>

                <Badge variant="secondary">
                  {a.type}
                </Badge>
              </div>

            </div>

            {/* Course */}
            <div>{a.course}</div>

            {/* Date */}
            <div>
              <div>{a.date}</div>
              <div className="text-xs text-muted-foreground">
                {a.time}
              </div>
            </div>

            {/* Lang */}
            <Badge variant="outline">
              {a.lang}
            </Badge>

            {/* Qs */}
            <div className="font-semibold">
              {a.qs}
            </div>

            {/* Action */}
            <div className="flex items-center gap-2 text-blue-600 cursor-pointer">
              <Eye size={16} />
              View
              <ChevronRight size={16} />
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default PastAssessmentsPage;