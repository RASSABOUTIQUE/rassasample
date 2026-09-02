import { useState, useEffect } from "react";
import { Search, Plus, Folder, Image as ImageIcon, Trash2, Link as LinkIcon, Copy, ExternalLink } from "lucide-react";
import { mediaService, type MediaAsset } from "@/services/MediaService";

export function AdminMediaLibrary({ showToast }: { showToast: (msg: string, type?: "success" | "error") => void }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | "all">("all");
  const [showAdd, setShowAdd] = useState(false);

  // New asset form
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [folder, setFolder] = useState("");

  const loadMedia = async () => {
    setLoading(true);
    const data = await mediaService.getAll();
    const fData = await mediaService.getFolders();
    setAssets(data);
    setFolders(fData);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    await mediaService.add(url, title, folder || "uncategorized");
    setUrl(""); setTitle(""); setFolder("");
    setShowAdd(false);
    showToast("Media asset added successfully.");
    loadMedia();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this media link?")) {
      await mediaService.delete(id);
      showToast("Media asset deleted.");
      loadMedia();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("URL copied to clipboard.");
  };

  const filtered = assets.filter(a => {
    if (selectedFolder !== "all" && a.folder !== selectedFolder) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display text-ivory">Media Library</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage external image URLs for use across the site.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Media URL
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-card border border-border p-5 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-ivory">Add New External Media</h3>
            <button type="button" onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-red-400 text-xs">Cancel</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-muted-foreground mb-1">Image URL *</label>
              <input type="url" required value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-muted-foreground mb-1">Title (Optional)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Bridal Saree Hero" className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-muted-foreground mb-1">Folder</label>
              <input type="text" value={folder} onChange={e => setFolder(e.target.value)} placeholder="products, banners, etc." className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
            </div>
          </div>
          <button type="submit" className="btn-gold text-xs px-4 py-2">Save Asset</button>
        </form>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar / Folders */}
        <div className="w-full md:w-48 shrink-0 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Folders</div>
          <button onClick={() => setSelectedFolder("all")} className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors text-left ${selectedFolder === "all" ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-gold/5"}`}>
            <ImageIcon className="w-4 h-4" /> All Media
          </button>
          {folders.map(f => (
            <button key={f} onClick={() => setSelectedFolder(f)} className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors text-left ${selectedFolder === f ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-gold/5"}`}>
              <Folder className="w-4 h-4" /> {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border pl-9 pr-4 py-2 text-sm outline-none focus:border-gold"
            />
          </div>

          {loading ? (
            <div className="text-center py-10 text-muted-foreground text-sm">Loading media...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 border border-border bg-card/50 text-muted-foreground text-sm">
              No media assets found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(a => (
                <div key={a.id} className="group border border-border bg-card rounded overflow-hidden">
                  <div className="aspect-square relative bg-background flex items-center justify-center p-2">
                    <img src={a.url} alt={a.title} className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.src = "https://placehold.co/400?text=Error")} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => copyToClipboard(a.url)} title="Copy URL" className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-ivory hover:text-gold hover:border-gold transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <a href={a.url} target="_blank" rel="noreferrer" title="Open Original" className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-ivory hover:text-gold hover:border-gold transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleDelete(a.id)} title="Delete" className="w-8 h-8 rounded-full bg-red-900/50 border border-red-500/50 flex items-center justify-center text-red-300 hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2 border-t border-border">
                    <div className="text-xs font-medium text-ivory truncate" title={a.title}>{a.title}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5 truncate">{a.url}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
