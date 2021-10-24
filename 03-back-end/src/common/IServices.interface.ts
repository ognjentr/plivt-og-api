import AuthorService from "../components/author/service";
import BookService from "../components/book/service";
import CategoryService from "../components/category/service";
import LocationService from "../components/location/service";
import PublisherService from "../components/publisher/service";
import UserService from "../components/user/service";

export default interface IServices {
    publisherService: PublisherService;
    locationService: LocationService;
    userService: UserService;
    authorService: AuthorService;
    categoryService: CategoryService;
    bookService: BookService;
}