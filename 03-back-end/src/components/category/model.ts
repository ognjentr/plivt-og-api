class CategoryModel{
    categoryId:number;
    name:string;
    imagePath:string;
    parentCategoryId:number | null = null;
    parentCategory: CategoryModel | null = null;
    subcategories: categoryModel[] = [];
    
}
export default CategoryModel;