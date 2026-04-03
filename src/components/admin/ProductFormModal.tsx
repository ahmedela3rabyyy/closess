import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Upload, CheckCircle2, Plus, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Product, STANDARD_SIZES } from '../../data/products';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  subtitle: z.string().min(3, 'Subtitle must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  originalPrice: z.number().optional(),
  category: z.enum(['men', 'women', 'accessories']),
  image: z.string().min(1, 'Main image is required').refine((val) => {
    return val.startsWith('/') || val.startsWith('data:image') || val.startsWith('http');
  }, 'Must be a valid image path, URL, or uploaded file'),
  images: z.array(z.string()).default([]),
  soldOut: z.boolean(),
  isNew: z.boolean(),
  isSale: z.boolean(),
  sizeStock: z.record(z.string(), z.number().min(0, 'Stock cannot be negative')),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Product | null;
}

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData }: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      subtitle: '',
      description: '',
      price: 0,
      originalPrice: 0,
      discountPercentage: 0,
      category: 'men',
      image: '',
      images: [],
      soldOut: false,
      isNew: true,
      isSale: false,
      sizeStock: STANDARD_SIZES.reduce((acc, size) => ({ ...acc, [size]: 10 }), {}),
      seoTitle: '',
      seoDescription: '',
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'images',
  });

  const watchPrice = watch('price');
  const watchOriginalPrice = watch('originalPrice');
  const watchDiscount = watch('discountPercentage');

  // Handle Discount % -> Price sync
  useEffect(() => {
    if (watchOriginalPrice > 0 && watchDiscount >= 0) {
      const calculatedPrice = Math.round(watchOriginalPrice * (1 - watchDiscount / 100));
      if (calculatedPrice !== watchPrice) {
        setValue('price', calculatedPrice, { shouldValidate: true });
      }
    }
  }, [watchDiscount, watchOriginalPrice]);

  // Handle Price -> Discount % sync (Optional: Only if user manually changes price)
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);
    if (watchOriginalPrice > 0 && newPrice > 0) {
      const calculatedDiscount = Math.round(((watchOriginalPrice - newPrice) / watchOriginalPrice) * 100);
      setValue('discountPercentage', calculatedDiscount, { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const discount = initialData.originalPrice 
          ? Math.round(((initialData.originalPrice - initialData.price) / initialData.originalPrice) * 100)
          : 0;
        
        reset({
          ...initialData,
          discountPercentage: discount,
          images: initialData.images || [],
          seoTitle: initialData.seoTitle || '',
          seoDescription: initialData.seoDescription || '',
          sizeStock: initialData.sizeStock || STANDARD_SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}),
        } as any);
      } else {
        reset({
          name: '',
          subtitle: '',
          description: '',
          price: 0,
          originalPrice: 0,
          discountPercentage: 0,
          category: 'men',
          image: '',
          images: [],
          soldOut: false,
          isNew: true,
          isSale: false,
          sizeStock: STANDARD_SIZES.reduce((acc, size) => ({ ...acc, [size]: 10 }), {}),
          seoTitle: '',
          seoDescription: '',
        });
      }
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = (data: ProductFormData) => {
    const finalData = {
      ...data,
      images: [data.image, ...(data.images || [])].filter((img, i, self) => img && self.indexOf(img) === i),
      sizes: data.category === 'accessories' ? ['One Size'] : STANDARD_SIZES as any,
      colors: [{ name: 'Default', hex: '#000000' }],
      rating: (initialData as any)?.rating || 5.0,
      reviews: (initialData as any)?.reviews || 0,
    };
    
    onSubmit(finalData);
    toast.success(initialData ? 'System logic updated' : 'Product deployed to ecosystem');
    onClose();
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          append(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-neutral-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-neutral-950/50">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,191,255,0.1)]">
                <Plus size={32} />
              </div>
              <div>
                <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter">
                  {initialData ? 'Edit Product' : 'Architectural Entry'}
                </h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1 space-x-2">
                  <span className="text-primary/60">NYX HUB</span>
                  <span>•</span>
                  <span>{initialData ? 'SYSTEM MODIFICATION' : 'ECOSYSTEM EXPANSION'}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-500/20 transition-all group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar scroll-smooth">
            
            {/* Section 1: Core Specs */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-primary/30" />
                <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Core Specifications</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Product Name</label>
                    <input
                      {...register('name')}
                      placeholder="e.g. MEN BOXY OVERSIZED"
                      className="w-full bg-black border border-white/5 text-white px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all italic font-black uppercase placeholder:opacity-20"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-widest">{(errors.name as any).message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Subtitle</label>
                    <input
                      {...register('subtitle')}
                      placeholder="e.g. KNITTED WOOL BLEND"
                      className="w-full bg-black border border-white/5 text-white px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all uppercase tracking-widest font-bold text-xs"
                    />
                    {errors.subtitle && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-widest">{(errors.subtitle as any).message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6 bg-black/30 p-6 rounded-3xl border border-white/5">
                    <div className="col-span-2">
                       <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 mb-2">Pricing Engine (EGP)</label>
                    </div>
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Original Price</label>
                      <input
                        type="number"
                        min="1"
                        {...register('originalPrice', { valueAsNumber: true })}
                        placeholder="1200"
                        className="w-full bg-black border border-white/5 text-gray-400 px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-[0.4em] text-primary mb-2">Discount %</label>
                      <input
                        type="number"
                        {...register('discountPercentage', { valueAsNumber: true })}
                        placeholder="20"
                        className="w-full bg-black border border-primary/30 text-primary px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all font-black"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[8px] font-black uppercase tracking-[0.4em] text-white mb-2">Final Sale Price</label>
                      <input
                        type="number"
                        min="1"
                        {...register('price', { valueAsNumber: true })}
                        onChange={handlePriceChange}
                        placeholder="890"
                        className="w-full bg-primary/10 border border-primary/20 text-primary px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all font-black text-xl"
                      />
                      {errors.price && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-widest">{(errors.price as any).message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 mb-4">Size Inventory Intelligence</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-black/40 p-6 rounded-[32px] border border-white/5">
                      {watch('category') === 'accessories' ? (
                        <div className="col-span-full">
                          <label className="block text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">One Size Stock</label>
                          <input
                            type="number"
                            min="0"
                            {...register('sizeStock.One Size', { valueAsNumber: true })}
                            className="w-full bg-black border border-white/5 text-primary px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all font-black"
                          />
                        </div>
                      ) : (
                        STANDARD_SIZES.map((size) => (
                          <div key={size} className="space-y-2">
                            <label className="block text-[9px] font-black uppercase tracking-widest text-gray-600 text-center">{size}</label>
                            <input
                              type="number"
                              min="0"
                              {...register(`sizeStock.${size}`, { valueAsNumber: true })}
                              placeholder="0"
                              className="w-full bg-black border border-white/5 text-white px-4 py-3 rounded-xl focus:border-primary focus:outline-none transition-all text-center font-bold text-xs"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Category</label>
                    <select
                      {...register('category')}
                      className="w-full bg-black border border-white/5 text-white px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all font-bold uppercase tracking-widest text-xs h-14"
                    >
                      <option value="men">Menswear</option>
                      <option value="women">Womenswear</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="flex gap-6">
                    <label className="flex-1 flex items-center gap-4 p-5 bg-black/50 border border-white/5 rounded-2xl cursor-pointer hover:border-primary/30 transition-all group">
                      <input type="checkbox" {...register('isNew')} className="w-5 h-5 accent-primary" />
                      <div>
                        <p className="text-white text-[10px] font-black uppercase tracking-widest">New Season</p>
                        <p className="text-gray-600 text-[8px] uppercase font-bold">Featured badge</p>
                      </div>
                    </label>
                    <label className="flex-1 flex items-center gap-4 p-5 bg-black/50 border border-white/5 rounded-2xl cursor-pointer hover:border-primary/30 transition-all group">
                      <input type="checkbox" {...register('soldOut')} className="w-5 h-5 accent-red-500" />
                      <div>
                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Sold Out</p>
                        <p className="text-gray-600 text-[8px] uppercase font-bold">Disable purchase</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Product Narrative</label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      placeholder="Describe the architectural depth..."
                      className="w-full bg-black border border-white/5 text-gray-300 px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm leading-relaxed"
                    />
                    {errors.description && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-widest">{(errors.description as any).message}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Gallery */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-primary/30" />
                <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Media Architecture</h3>
              </div>

              <div className="grid lg:grid-cols-3 gap-10">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Master Image</label>
                  <div className="relative aspect-[3/4] bg-black border border-white/10 rounded-3xl overflow-hidden group">
                    {watch('image') ? (
                      <img src={watch('image')} alt="Primary" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                        <Upload size={32} />
                        <span className="text-[10px] font-black mt-2 tracking-widest">NO IMAGE</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      {...register('image')}
                      placeholder="Main URL..."
                      className="flex-1 bg-black border border-white/5 text-[10px] px-4 py-3 rounded-xl focus:border-primary focus:outline-none"
                    />
                    <label className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl cursor-pointer transition-colors">
                      <Upload size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setValue('image', reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Product Gallery</label>
                    <label className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-black px-4 py-2 rounded-full cursor-pointer transition-all text-[10px] font-bold">
                      <Upload size={14} />
                      <span>MULTIPLE UPLOAD</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleMultipleFilesChange} />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-black/30 border border-white/5 rounded-[32px] min-h-[200px]">
                    {fields.map((field, index) => (
                      <div key={field.id} className="relative aspect-[3/4] group">
                        <img src={watch(`images.${index}`)} alt="Gallery" className="w-full h-full object-cover rounded-xl border border-white/5 shadow-xl" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                          <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-20"><ChevronLeft size={16} /></button>
                          <button type="button" onClick={() => remove(index)} className="w-9 h-9 flex items-center justify-center bg-red-500/80 hover:bg-red-500 rounded-full text-white"><Trash2 size={16} /></button>
                          <button type="button" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-20"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => append('')}
                      className="aspect-[3/4] border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-gray-700 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <Plus size={24} />
                      <span className="text-[8px] font-black uppercase mt-2">ADD SLOT</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: SEO */}
            <section className="space-y-8 p-10 bg-primary/5 rounded-[40px] border border-primary/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-primary/30" />
                  <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">SEO Intelligence Suite</h3>
                </div>
                <div className="flex items-center gap-2 text-primary/40">
                  <Search size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Google Preview Active</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary/50 mb-2">Meta Title</label>
                  <input
                    {...register('seoTitle')}
                    placeholder={watch('name') || "Architectural piece | NYX"}
                    className="w-full bg-neutral-900 border border-primary/10 text-white px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary/50 mb-2">Meta Description</label>
                  <textarea
                    {...register('seoDescription')}
                    rows={3}
                    placeholder="Premium architectural knitwear crafted for those who define the future..."
                    className="w-full bg-neutral-900 border border-primary/10 text-white px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm leading-relaxed"
                  />
                </div>

                <div className="p-6 bg-white rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-[#202124] text-sm">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-400">N</div>
                    <span className="text-[#202124]">nyx.com › products › ...</span>
                  </div>
                  <h4 className="text-[#1a0dab] text-xl font-normal hover:underline cursor-pointer">
                    {watch('seoTitle') || watch('name') || "Product Name | NYX Studio"}
                  </h4>
                  <p className="text-[#4d5156] text-sm leading-relaxed line-clamp-2">
                    {watch('seoDescription') || watch('description') || "Premium high-end fashion experience curated with architectural precision."}
                  </p>
                </div>
              </div>
            </section>

          </form>

          <div className="p-8 border-t border-white/5 bg-neutral-950/50 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-6 rounded-2xl border border-white/10 text-gray-500 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white/5 transition-all hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onFormSubmit, (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError?.message) {
                  toast.error(firstError.message as string);
                }
              })}
              disabled={isSubmitting}
              className="flex-[2] py-6 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_0_50px_rgba(0,191,255,0.2)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  {initialData ? 'Commit System Updates' : 'Deploy Product to Ecosystem'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
