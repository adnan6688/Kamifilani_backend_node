import axios from "axios";
import { Category } from "./categori.model";

const staticCategories = [
    { id: 90001, name: "Sports", slug: "sport" },
    { id: 90002, name: "Politics", slug: "politics"},
    { id: 90003, name: "Trending", slug: "trending" },
    { id: 90004, name: "National", slug: "national"},
    { id: 90005, name: "Business", slug: "business"},
    { id: 900036, name: "News", slug: "news"},
    { id: 9000378, name: "Music", slug: "music"},
];

const getAllCategories = async () => {

    // API fetch
    const { data: apiCategories } = await axios.get(
        "https://kemifilani.ng/wp-json/wp/v2/categories?_fields=id,name,slug,count"
    );

    //  merge API + static
    const allCategories = [...apiCategories, ...staticCategories];

    //  remove duplicates by slug
    const map = new Map();

    allCategories.forEach((cat) => {
        map.set(cat.slug, cat);
    });

    const uniqueCategories = Array.from(map.values());

    //  save to DB (upsert)
    for (const cat of uniqueCategories) {
        await Category.updateOne(
            { slug: cat.slug }, // unique key
            {
                $set: {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                },
            },
            { upsert: true }
        );
    }

    return uniqueCategories;
};



const searchByCategoriesService = async (searchItem: string) => {

    const { data } = await axios.get(`https://kemifilani.ng/wp-json/wp/v2/categories?search=${searchItem}&_fields=id,name,slug,count,link`)
    return data
}




export const CategoryService = {
    searchByCategoriesService,
    getAllCategories
}