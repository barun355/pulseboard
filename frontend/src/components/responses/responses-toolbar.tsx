import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExportDropdown } from "./export-dropdown"

interface ResponsesToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  ratingFilter: string
  onRatingFilterChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  onExportAll: () => void
  onExportFiltered: () => void
  filteredCount: number
  totalCount: number
}

export function ResponsesToolbar({
  search,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  statusFilter,
  onStatusFilterChange,
  onExportAll,
  onExportFiltered,
  filteredCount,
  totalCount,
}: ResponsesToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search respondent..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="5">5★</SelectItem>
          <SelectItem value="4">4★</SelectItem>
          <SelectItem value="3">3★</SelectItem>
          <SelectItem value="2">2★</SelectItem>
          <SelectItem value="1">1★</SelectItem>
          <SelectItem value="none">No rating</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="partial">Partial</SelectItem>
        </SelectContent>
      </Select>
      <ExportDropdown
        onExportAll={onExportAll}
        onExportFiltered={onExportFiltered}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />
    </div>
  )
}
