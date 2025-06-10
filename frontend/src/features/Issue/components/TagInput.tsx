import React from 'react';
import { FiTag, FiX } from 'react-icons/fi';

const TagInput = ({ tagInput, setTagInput, tags, setFormData, isSubmitting }: any) => {
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setFormData((prev: any) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev: any) => ({ ...prev, tags: prev.tags.filter((tag: string) => tag !== tagToRemove) }));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2"><FiTag className="inline w-4 h-4 mr-1" /> Tags</label>
      <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Type and press Enter..." disabled={isSubmitting} />
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag: string, idx: number) => (
          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {tag}
            <button type="button" onClick={() => handleRemoveTag(tag)} className="text-blue-600 hover:text-blue-800" disabled={isSubmitting}>
              <FiX className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
