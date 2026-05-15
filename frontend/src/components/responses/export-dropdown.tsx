import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ExportDropdownProps {
  onExportAll: () => void
  onExportFiltered: () => void
  filteredCount: number
  totalCount: number
}

export function ExportDropdown({
  onExportAll,
  onExportFiltered,
  filteredCount,
  totalCount,
}: ExportDropdownProps) {
  const isFiltered = filteredCount !== totalCount

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="size-3.5" />
          Export CSV
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportAll}>
          Export All ({totalCount})
        </DropdownMenuItem>
        {isFiltered && (
          <DropdownMenuItem onClick={onExportFiltered}>
            Export Filtered ({filteredCount})
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
