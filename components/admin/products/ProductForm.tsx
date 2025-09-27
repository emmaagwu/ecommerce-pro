"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UploadButton } from "@/utils/uploadthing";
import { X, Plus } from "lucide-react";
import Image from "next/image";

interface FilterItem {
  id: string;
  name: string;
}

interface SubcategoryItem extends FilterItem {
  category: string;
}

interface FilterOptions {
  categories: FilterItem[];
  subcategories: SubcategoryItem[];
  brands: FilterItem[];
  colors: FilterItem[];
  sizes: FilterItem[];
  tags: FilterItem[];
  priceRange: {
    min: number;
    max: number;
  };
}

interface ProductFormValues {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  colors: string[];
  sizes: string[];
  tags: string[];
  image: string;
  images: string[];
  inStock: boolean;
}

interface ProductFormProps {
  productId?: string; // If provided, we're in edit mode
  onSuccess?: () => void;
}

export default function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    subcategories: [],
    brands: [],
    colors: [],
    sizes: [],
    tags: [],
    priceRange: { min: 0, max: 0 },
  });

  const [newInputs, setNewInputs] = useState({
    category: "",
    subcategory: "",
    brand: "",
    color: "",
    size: "",
    tag: "",
  });

  const [showNewInputs, setShowNewInputs] = useState({
    category: false,
    subcategory: false,
    brand: false,
    color: false,
    size: false,
    tag: false,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isEditMode = !!productId;

  const { register, handleSubmit, watch, control, reset, setValue, getValues } =
    useForm<ProductFormValues>({
      defaultValues: {
        name: "",
        price: 0,
        originalPrice: undefined,
        description: "",
        category: "",
        subcategory: "",
        brand: "",
        colors: [],
        sizes: [],
        tags: [],
        image: "",
        images: [],
        inStock: true,
      },
    });

  const watchCategory = watch("category");
  const watchMainImage = watch("image");
  const watchAdditionalImages = watch("images");
  const baseRoute = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch filters
        const filtersRes = await fetch(`${baseRoute}/api/filters/`);
        const filtersData = await filtersRes.json();
        setFilters(filtersData);

        // If editing, fetch product data
        if (isEditMode) {
          const productRes = await fetch(`${baseRoute}/api/products/${productId}/`);
          const productData = await productRes.json();

          reset({
            name: productData.name,
            price: productData.price,
            originalPrice: productData.originalPrice,
            description: productData.description,
            category: productData.category?.name || "",
            subcategory: productData.subcategory?.name || "",
            brand: productData.brand?.name || "",
            colors: productData.colors?.map((c: FilterItem) => c.name) || [],
            sizes: productData.sizes?.map((s: FilterItem) => s.name) || [],
            tags: productData.tags?.map((t: FilterItem) => t.name) || [],
            image: productData.image || "",
            images: productData.images || [],
            inStock: productData.inStock,
          });
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [productId, isEditMode, baseRoute, reset]);

  // Filter subcategories based on selected category
  const availableSubcategories = watchCategory
    ? filters.subcategories.filter(sub => sub.category === watchCategory)
    : filters.subcategories;

  const toggleNewInput = (field: keyof typeof showNewInputs) => {
    setShowNewInputs(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // --- INSTANT FILTER ADDITION ---
  const addNewFilter = (field: keyof typeof newInputs) => {
    const value = newInputs[field].trim();
    if (!value) return;

    setFilters(prevFilters => {
      let updated = { ...prevFilters };
      switch (field) {
        case 'category':
          if (!prevFilters.categories.find(c => c.name === value)) {
            updated.categories = [...prevFilters.categories, { id: `new-${Date.now()}`, name: value }];
          }
          break;
        case 'subcategory':
          if (!prevFilters.subcategories.find(s => s.name === value)) {
            updated.subcategories = [
              ...prevFilters.subcategories,
              { id: `new-${Date.now()}`, name: value, category: getValues('category') }
            ];
          }
          break;
        case 'brand':
          if (!prevFilters.brands.find(b => b.name === value)) {
            updated.brands = [...prevFilters.brands, { id: `new-${Date.now()}`, name: value }];
          }
          break;
        case 'color':
          if (!prevFilters.colors.find(c => c.name === value)) {
            updated.colors = [...prevFilters.colors, { id: `new-${Date.now()}`, name: value }];
          }
          break;
        case 'size':
          if (!prevFilters.sizes.find(s => s.name === value)) {
            updated.sizes = [...prevFilters.sizes, { id: `new-${Date.now()}`, name: value }];
          }
          break;
        case 'tag':
          if (!prevFilters.tags.find(t => t.name === value)) {
            updated.tags = [...prevFilters.tags, { id: `new-${Date.now()}`, name: value }];
          }
          break;
      }
      return updated;
    });

    switch (field) {
      case 'category': setValue('category', value); break;
      case 'subcategory': setValue('subcategory', value); break;
      case 'brand': setValue('brand', value); break;
      case 'color': {
        const currentColors = getValues('colors');
        if (!currentColors.includes(value)) setValue('colors', [...currentColors, value]);
        break;
      }
      case 'size': {
        const currentSizes = getValues('sizes');
        if (!currentSizes.includes(value)) setValue('sizes', [...currentSizes, value]);
        break;
      }
      case 'tag': {
        const currentTags = getValues('tags');
        if (!currentTags.includes(value)) setValue('tags', [...currentTags, value]);
        break;
      }
    }

    setNewInputs(prev => ({ ...prev, [field]: "" }));
    setShowNewInputs(prev => ({ ...prev, [field]: false }));
  };

  const removeMainImage = () => {
    setValue("image", "");
  };

  const removeAdditionalImage = (indexToRemove: number) => {
    const currentImages = getValues("images");
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
    setValue("images", updatedImages);
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (isUploading) {
      toast.error("Please wait for image uploads to complete");
      return;
    }

    setSubmitting(true);
    try {
      // PATCH: Only use IDs that are not "new-" (local UI only!), else send as name
      const payload: any = {
        name: data.name,
        price: parseFloat(String(data.price)),
        originalPrice: data.originalPrice ? parseFloat(String(data.originalPrice)) : undefined,
        description: data.description,
        image: data.image,
        images: data.images,
        inStock: data.inStock,
      };

      // Category
      const existingCategory = filters.categories.find(c => c.name === data.category);
      if (existingCategory && !existingCategory.id.startsWith("new-")) {
        payload.category_id = existingCategory.id;
      } else if (data.category) {
        payload.category_name = data.category;
      }

      // Subcategory
      const existingSubcategory = filters.subcategories.find(s => s.name === data.subcategory);
      if (existingSubcategory && !existingSubcategory.id.startsWith("new-")) {
        payload.subcategory_id = existingSubcategory.id;
      } else if (data.subcategory) {
        payload.subcategory_name = data.subcategory;
      }

      // Brand
      const existingBrand = filters.brands.find(b => b.name === data.brand);
      if (existingBrand && !existingBrand.id.startsWith("new-")) {
        payload.brand_id = existingBrand.id;
      } else if (data.brand) {
        payload.brand_name = data.brand;
      }

      const handleManyToMany = (values: string[], filterList: FilterItem[], fieldName: string) => {
        const existingIds: string[] = [];
        const newNames: string[] = [];
        values.forEach(value => {
          const existing = filterList.find(item => item.name === value);
          if (existing && !existing.id.startsWith("new-")) {
            existingIds.push(existing.id);
          } else {
            newNames.push(value);
          }
        });
        if (existingIds.length > 0) {
          payload[`${fieldName}_ids`] = existingIds;
        }
        if (newNames.length > 0) {
          payload[`${fieldName}_names`] = newNames;
        }
      };

      handleManyToMany(data.colors, filters.colors, 'color');
      handleManyToMany(data.sizes, filters.sizes, 'size');
      handleManyToMany(data.tags, filters.tags, 'tag');

      const url = isEditMode
        ? `${baseRoute}/api/products/${productId}/`
        : `${baseRoute}/api/products/`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }

      toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully!`);
      if (!isEditMode) {
        reset();
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error(`Error ${isEditMode ? 'updating' : 'creating'} product`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <form
      className="w-full max-w-2xl mx-auto p-4 md:p-8 space-y-8 bg-white rounded-xl shadow border border-gray-100"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      {/* Product Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-1">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isEditMode
              ? "Update the details below to edit this product."
              : "Fill all required fields to create a new product."}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            {isEditMode ? "EDIT MODE" : "CREATE MODE"}
          </span>
          {submitting || isUploading ? (
            <span className="inline-flex items-center gap-2 text-xs text-gray-500">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />{" "}
              {submitting ? "Saving..." : "Uploading..."}
            </span>
          ) : null}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Name *</Label>
          <Input
            {...register("name", { required: true })}
            placeholder="Product Name"
            className="mt-1"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Price *</Label>
            <Input
              type="number"
              step="0.01"
              {...register("price", {
                required: true,
                valueAsNumber: true,
              })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Original Price</Label>
            <Input
              type="number"
              step="0.01"
              {...register("originalPrice", {
                valueAsNumber: true,
              })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Description *</Label>
        <Textarea
          {...register("description", { required: true })}
          rows={3}
          className="mt-1"
          placeholder="Enter a detailed product description"
        />
      </div>

      {/* Category/Brand */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category */}
        <div>
          <Label className="text-sm font-medium">Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select or add category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleNewInput('category')}
                    className="border hover:bg-blue-50"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {showNewInputs.category && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="New category name"
                      value={newInputs.category}
                      onChange={(e) => setNewInputs(prev => ({ ...prev, category: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewFilter('category'))}
                    />
                    <Button type="button" onClick={() => addNewFilter('category')}>
                      Add
                    </Button>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Subcategory */}
        <div>
          <Label className="text-sm font-medium">Subcategory</Label>
          <Controller
            control={control}
            name="subcategory"
            render={({ field }) => (
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select or add subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.name}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleNewInput('subcategory')}
                    className="border hover:bg-blue-50"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {showNewInputs.subcategory && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="New subcategory name"
                      value={newInputs.subcategory}
                      onChange={(e) => setNewInputs(prev => ({ ...prev, subcategory: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewFilter('subcategory'))}
                    />
                    <Button type="button" onClick={() => addNewFilter('subcategory')}>
                      Add
                    </Button>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Brand */}
        <div>
          <Label className="text-sm font-medium">Brand</Label>
          <Controller
            control={control}
            name="brand"
            render={({ field }) => (
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select or add brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.name}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleNewInput('brand')}
                    className="border hover:bg-blue-50"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {showNewInputs.brand && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="New brand name"
                      value={newInputs.brand}
                      onChange={(e) => setNewInputs(prev => ({ ...prev, brand: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewFilter('brand'))}
                    />
                    <Button type="button" onClick={() => addNewFilter('brand')}>
                      Add
                    </Button>
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Multi-selects for sizes, colors, tags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'sizes', label: 'Sizes', data: filters.sizes },
          { name: 'colors', label: 'Colors', data: filters.colors },
          { name: 'tags', label: 'Tags', data: filters.tags }
        ].map(({ name, label, data }) => (
          <div key={name} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">{label}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="border hover:bg-blue-50"
                onClick={() => toggleNewInput(name as keyof typeof showNewInputs)}
              >
                <Plus size={14} className="mr-1" />
                Add New
              </Button>
            </div>
            {showNewInputs[name as keyof typeof showNewInputs] && (
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder={`New ${name.slice(0, -1)} name`}
                  value={newInputs[name as keyof typeof newInputs]}
                  onChange={(e) => setNewInputs(prev => ({ ...prev, [name]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewFilter(name as keyof typeof newInputs))}
                  className="text-sm"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addNewFilter(name as keyof typeof newInputs)}
                >
                  Add
                </Button>
              </div>
            )}
            <Controller
              control={control}
              name={name as keyof ProductFormValues}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {data.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 px-2 py-1 border rounded text-sm hover:bg-gray-50 cursor-pointer">
                      <Checkbox
                        checked={Array.isArray(field.value) && field.value.includes(item.name)}
                        onCheckedChange={(checked) => {
                          const currentValue = Array.isArray(field.value) ? field.value : [];
                          if (checked) {
                            field.onChange([...currentValue, item.name]);
                          } else {
                            field.onChange(currentValue.filter((v) => v !== item.name));
                          }
                        }}
                      />
                      <span className="truncate">{item.name}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>
        ))}
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium">Main Product Image</Label>
          <div className="mt-2 flex flex-wrap gap-4">
            {watchMainImage ? (
              <div className="relative">
                <Image
                  src={watchMainImage}
                  alt="Main product image"
                  width={128}
                  height={128}
                  className="object-cover rounded-md border w-32 h-32"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <UploadButton
                endpoint="mainImageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setValue("image", res[0].url);
                    toast.success("Main image uploaded successfully!");
                  }
                  setIsUploading(false);
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Upload failed: ${error.message}`);
                  setIsUploading(false);
                }}
                onUploadBegin={() => {
                  setIsUploading(true);
                }}
              />
            )}
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium">Additional Images (Max 3)</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {watchAdditionalImages.length > 0 && (
              watchAdditionalImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <Image
                    src={imageUrl}
                    alt={`Additional product image ${index + 1}`}
                    width={96}
                    height={96}
                    className="object-cover rounded-md border w-20 h-20"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))
            )}
            {watchAdditionalImages.length < 3 && (
              <div>
                <UploadButton
                  endpoint="additionalImagesUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      const currentImages = getValues("images");
                      const newImageUrls = res.map(file => file.url);
                      const allImages = [...currentImages, ...newImageUrls];
                      const limitedImages = allImages.slice(0, 3);
                      setValue("images", limitedImages);
                      toast.success(`${res.length} additional image(s) uploaded successfully!`);
                    }
                    setIsUploading(false);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`);
                    setIsUploading(false);
                  }}
                  onUploadBegin={() => {
                    setIsUploading(true);
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {watchAdditionalImages.length}/3 images uploaded
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="inStock"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <Label className="text-sm cursor-pointer">In Stock</Label>
            </div>
          )}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full py-3 text-base font-semibold rounded-lg mt-6"
        disabled={submitting || isUploading}
      >
        {submitting
          ? `${isEditMode ? 'Updating' : 'Creating'} Product...`
          : isUploading
            ? "Uploading images..."
            : `${isEditMode ? 'Update' : 'Create'} Product`
        }
      </Button>
    </form>
  );
}