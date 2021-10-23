import CategoryService from "../components/category/service";

export default interface IServices {
    publisherService: any;
    locationService: any;
    userService: any;
    authorService: any;
    categoryService: CategoryService;
}