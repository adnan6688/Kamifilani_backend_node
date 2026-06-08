


import { Query } from "mongoose";
const excludeField = ["searchTerm", "sort", "fields", "limit", "page"]


export class QueryBuilder<T> {

    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>;
    private filterQuery: Record<string, any> = {};


    constructor(modelQuery: Query<T[], T>, query: Record<string, string>, baseFilter: Record<string, any> = {}) {
        this.modelQuery = modelQuery;
        this.query = query;
        this.filterQuery = baseFilter;
    }

   
    filter(): this {
        const filter = { ...this.filterQuery, ...this.query }
        // ai kahne amra sort,  skip ,  limit ,  searchTerm gula   filter theke bad diye dibo
        // KARON filter diye sudu amra exac match korte parbo..

        // sort , skip, searcterm kaj korbe na tay bad diye disi
        for (const field of excludeField) {
            delete filter[field]
        }
        this.filterQuery = filter  // update here

        this.modelQuery = this.modelQuery.find(filter) // User.find().find(filter)
        return this

    }


    
    search(searchableField: string[]): this {
        const searchTerm = this.query.searchTerm;

        if (!searchTerm) return this;

        const searchQuery = {
            $or: searchableField.map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        };

        this.modelQuery = this.modelQuery.find(searchQuery);

        return this;
    }


    sort(): this {
        const sort = this.query.sort || "-createdAt"
        this.modelQuery = this.modelQuery.sort(sort)
        return this
    }


    fields(): this {
        const fields = this.query?.fields?.split(",").join(" ") || ""
        this.modelQuery = this.modelQuery.select(fields)
        return this

    }


    // paginate koro jonno function
    paginate(): this {
        const page = Number(this.query.page) || 1
        const limit = Number(this.query?.limit) || 10
        const skip = (page - 1) * limit

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)

        return this
    }



    populate(field: any): this {
        this.modelQuery = this.modelQuery.populate(field)
        return this
    }

    // build function call kore amra model ar query ta k response hisebe niye nibo
    build() {
        return this.modelQuery
    }


    async getMeta() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const totalDocuments = await this.modelQuery.model.countDocuments(
            this.modelQuery.getFilter()
        );

        const totalpage = Math.ceil(totalDocuments / limit);

        return {
            page,
            limit,
            total: totalDocuments,
            totalpage,
        };
    }

}