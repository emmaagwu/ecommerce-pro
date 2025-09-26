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
import { X } from "lucide-react";
import Image from "next/image";

interface FilterOptions {
  categories: string[];
  subcategories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  tags: string[];
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

export default function ProductForm() {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    subcategories: [],
    brands: [],
    colors: [],
    sizes: [],
    tags: [],
  });

  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

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

  // const watchCategory = watch("category");
  const watchMainImage = watch("image");
  const watchAdditionalImages = watch("images");

  // Fetch filter options from backend
  useEffect(() => {
    async function fetchFilters() {
      try {
        const res = await fetch("/api/admin/filters");
        const data = await res.json();
        setFilters(data);
      } catch (err) {
        console.error("Failed to fetch filters", err);
        toast.error("Failed to load filter options");
      } finally {
        setLoading(false);
      }
    }
    fetchFilters();
  }, []);

  // Use all subcategories for now; filter by category if your backend supports it
  const subcategoryOptions = filters.subcategories;

  const addNewCategory = () => {
    if (newCategory && !filters.categories.includes(newCategory)) {
      setFilters({ ...filters, categories: [...filters.categories, newCategory] });
      setValue("category", newCategory);
      setNewCategory("");
    }
  };

  const addNewSubcategory = () => {
    if (newSubcategory && !filters.subcategories.includes(newSubcategory)) {
      setFilters({
        ...filters,
        subcategories: [...filters.subcategories, newSubcategory],
      });
      setValue("subcategory", newSubcategory);
      setNewSubcategory("");
    }
  };

  const addNewBrand = () => {
    if (newBrand && !filters.brands.includes(newBrand)) {
      setFilters({ ...filters, brands: [...filters.brands, newBrand] });
      setValue("brand", newBrand);
      setNewBrand("");
    }
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

    try {
      // Convert price fields to float before sending to the backend
      const payload = {
        ...data,
        price: parseFloat(String(data.price)),
        originalPrice: data.originalPrice ? parseFloat(String(data.originalPrice)) : undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create product");

      toast.success("Product created successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Error creating product");
    }
  };

  // Show loading spinner or message until filters are loaded
  if (loading) {
    return <div>Loading filter options...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input {...register("name", { required: true })} placeholder="Product Name" />
      </div>

      {/* Price */}
      <div>
        <Label>Price</Label>
        <Input
          type="number"
          step="0.01"
          {...register("price", {
            required: true,
            valueAsNumber: true,
          })}
        />
      </div>

      {/* Original Price */}
      <div>
        <Label>Original Price</Label>
        <Input
          type="number"
          step="0.01"
          {...register("originalPrice", {
            valueAsNumber: true,
          })}
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea {...register("description", { required: true })} rows={4} />
      </div>

      {/* Category */}
      <div>
        <Label>Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <div className="flex gap-2 items-center">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filters.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Add new"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="button" onClick={addNewCategory}>
                Add
              </Button>
            </div>
          )}
        />
      </div>

      {/* Subcategory */}
      <div>
        <Label>Subcategory</Label>
        <Controller
          control={control}
          name="subcategory"
          render={({ field }) => (
            <div className="flex gap-2 items-center">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategoryOptions.map((sc) => (
                    <SelectItem key={sc} value={sc}>
                      {sc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Add new"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
              />
              <Button type="button" onClick={addNewSubcategory}>
                Add
              </Button>
            </div>
          )}
        />
      </div>

      {/* Brand */}
      <div>
        <Label>Brand</Label>
        <Controller
          control={control}
          name="brand"
          render={({ field }) => (
            <div className="flex gap-2 items-center">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {filters.brands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Add new"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
              />
              <Button type="button" onClick={addNewBrand}>
                Add
              </Button>
            </div>
          )}
        />
      </div>

      {/* Sizes */}
      <div>
        <Label>Sizes</Label>
        <Controller
          control={control}
          name="sizes"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {filters.sizes.map((size) => (
                <label key={size} className="flex items-center gap-1">
                  <Checkbox
                    checked={field.value.includes(size)}
                    onCheckedChange={(checked) => {
                      if (checked) field.onChange([...field.value, size]);
                      else field.onChange(field.value.filter((v) => v !== size));
                    }}
                  />
                  {size}
                </label>
              ))}
            </div>
          )}
        />
      </div>

      {/* Colors */}
      <div>
        <Label>Colors</Label>
        <Controller
          control={control}
          name="colors"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {filters.colors.map((color) => (
                <label key={color} className="flex items-center gap-1">
                  <Checkbox
                    checked={field.value.includes(color)}
                    onCheckedChange={(checked) => {
                      if (checked) field.onChange([...field.value, color]);
                      else field.onChange(field.value.filter((v) => v !== color));
                    }}
                  />
                  {color}
                </label>
              ))}
            </div>
          )}
        />
      </div>

      {/* Tags */}
      <div>
        <Label>Tags</Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {filters.tags.map((tag) => (
                <label key={tag} className="flex items-center gap-1">
                  <Checkbox
                    checked={field.value.includes(tag)}
                    onCheckedChange={(checked) => {
                      if (checked) field.onChange([...field.value, tag]);
                      else field.onChange(field.value.filter((v) => v !== tag));
                    }}
                  />
                  {tag}
                </label>
              ))}
            </div>
          )}
        />
      </div>

      {/* Main Image Upload */}
      <div>
        <Label>Main Product Image</Label>
        <div className="space-y-2">
          {watchMainImage ? (
            <div className="relative inline-block">
              <Image 
                src={watchMainImage} 
                alt="Main product image" 
                className="w-32 h-32 object-cover rounded-md border"
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

      {/* Additional Images Upload */}
      <div>
        <Label>Additional Product Images (Optional - Max 3)</Label>
        <div className="space-y-2">
          {watchAdditionalImages.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {watchAdditionalImages.map((imageUrl, index) => (
                <div key={index} className="relative inline-block">
                  <Image 
                    src={imageUrl} 
                    alt={`Additional product image ${index + 1}`} 
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {watchAdditionalImages.length < 3 && (
            <UploadButton
              endpoint="additionalImagesUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  const currentImages = getValues("images");
                  const newImageUrls = res.map(file => file.url);
                  const allImages = [...currentImages, ...newImageUrls];
                  
                  // Ensure we don't exceed 3 images total
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
          )}
        </div>
        <p className="text-sm text-gray-500">
          {watchAdditionalImages.length}/3 additional images uploaded
        </p>
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="inStock"
          render={({ field }) => (
            <Checkbox checked={field.value} onCheckedChange={field.onChange}>
              In Stock
            </Checkbox>
          )}
        />
      </div>

      {/* Submit */}
      <Button 
        type="submit" 
        className="mt-4" 
        disabled={isUploading}
      >
        {isUploading ? "Uploading images..." : "Add Product"}
      </Button>
    </form>
  );
}