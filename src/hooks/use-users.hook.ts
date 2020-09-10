import {
  IAndFilterCriteria,
  IPropertyFilterCriterion,
} from "./../core/filters";
import { IGasStationAdministrator } from "./../interfaces/models/gas-station-administrator.model";
import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { IUserModel } from "../interfaces/models/user.model";
import { IGasStationModel } from "../interfaces/models/gas-station.model";
import { ISeller } from "../interfaces/models/seller.model";
import { useContext } from "react";
import { SecurityContext, RolesEnum } from "../contexts/security.context";
import { IFilterCriteria } from "../core/filters";

export type UserRecord = Pick<IUserModel, "id" | "username" | "roles"> & {
  gasStationAdministrator: Pick<IGasStationAdministrator, "id" | "name"> & {
    gasStation: Pick<IGasStationModel, "id" | "name">;
  };
  seller: Pick<ISeller, "id" | "name"> & {
    gasStation: Pick<IGasStationModel, "id" | "name">;
  };
};
export interface IUsersResult {
  users: {
    pageInfo: {
      total: number;
    };
    result: UserRecord[];
  };
}

const LIST_USERS_QUERY = gql`
  query users($max: Int, $skip: Int, $sort: String, $filter: String) {
    users(criteria: { max: $max, skip: $skip, sort: $sort, filter: $filter }) {
      pageInfo {
        total
      }
      result {
        id
        username
        roles {
          name
        }
        seller {
          id
          name
          gasStation {
            id
            name
          }
        }
        gasStationAdministrator {
          id
          name
          gasStation {
            id
            name
          }
        }
        coverageOperator {
          id
          name
          gasStation {
            id
            name
          }
        }
      }
    }
  }
`;

const useUsers = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
      criteria.pagination.pageSize
    : undefined;
  const [security] = useContext(SecurityContext);
  console.log("SECURITY: ", security.user);
  let filter: { and: {}[] } = {
    and: [
      {
        property: "customer.id",
        type: "null",
      },
    ],
  };
  if (
    security.user?.roles.map((r) => r.name).includes(RolesEnum.GasStationAdmin)
  ) {
    filter.and.push({
      or: [
        {
          property: "seller.gasStation.id",
          type: "eq",
          value: security.user.gasStationAdministrator?.gasStation.id,
        },
        {
          property: "gasStationAdministrator.gasStation.id",
          type: "eq",
          value: security.user.gasStationAdministrator?.gasStation.id,
        },
      ],
    });
  }
  if (criteria?.filter) {
    (criteria.filter as IAndFilterCriteria).and
      .map((c) => {
        const crit = c as IPropertyFilterCriterion;
        if (crit.property && crit.property === "gasStation.name") {
          return {
            or: [
              {
                property: "seller.gasStation.name",
                value: crit.value,
                type: crit.type,
              },
              {
                property: "gasStationAdministrator.gasStation.name",
                value: crit.value,
                type: crit.type,
              },
              {
                property: "coverageOperator.gasStation.name",
                value: crit.value,
                type: crit.type,
              },
            ],
          };
        } else {
          return c;
        }
      })
      .map((c) => filter.and.push(c));
  }
  const byGasStationSorter = criteria?.sort?.find(
    (s) => s.property === "gasStation.name"
  );
  if (criteria && criteria.sort && byGasStationSorter) {
    criteria.sort = [
      ...criteria?.sort?.filter((s) => s.property !== "gasStation.name"),
      ...[
        {
          property: "seller.gasStation.name",
          descending: byGasStationSorter.descending,
        },
        {
          property: "coverageOperator.gasStation.name",
          descending: byGasStationSorter.descending,
        },
        {
          property: "gasStationAdministrator.gasStation.name",
          descending: byGasStationSorter.descending,
        },
      ],
    ];
  }

  const { data, loading, error, refetch } = useQuery<IUsersResult>(
    LIST_USERS_QUERY,
    {
      variables: {
        filter: JSON.stringify(filter),
        max,
        skip,
        sort: JSON.stringify(criteria?.sort),
      },
    }
  );

  if (error) {
    throw error;
  }
  const total = data?.users.pageInfo.total;
  const users = data?.users.result;
  return { users, loading, refetch, total };
};

export const useUsersLazy = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
      criteria.pagination.pageSize
    : undefined;
  const [security] = useContext(SecurityContext);
  console.log("SECURITY: ", security.user);
  let filter: { and: {}[] } = {
    and: [
      {
        property: "customer.id",
        type: "null",
      },
    ],
  };
  if (
    security.user?.roles.map((r) => r.name).includes(RolesEnum.GasStationAdmin)
  ) {
    filter.and.push({
      or: [
        {
          property: "seller.gasStation.id",
          type: "eq",
          value: security.user.gasStationAdministrator?.gasStation.id,
        },
        {
          property: "gasStationAdministrator.gasStation.id",
          type: "eq",
          value: security.user.gasStationAdministrator?.gasStation.id,
        },
      ],
    });
  }
  if (criteria?.filter) {
    (criteria.filter as IAndFilterCriteria).and
      .map((c) => {
        const crit = c as IPropertyFilterCriterion;
        if (crit.property && crit.property === "gasStation.name") {
          return {
            or: [
              {
                property: "seller.gasStation.name",
                value: crit.value,
                type: crit.type,
              },
              {
                property: "gasStationAdministrator.gasStation.name",
                value: crit.value,
                type: crit.type,
              },
              {
                property: "coverageOperator.gasStation.name",
                value: crit.value,
                type: crit.type,
              },
            ],
          };
        } else {
          return c;
        }
      })
      .map((c) => filter.and.push(c));
  }
  const byGasStationSorter = criteria?.sort?.find(
    (s) => s.property === "gasStation.name"
  );
  if (criteria && criteria.sort && byGasStationSorter) {
    criteria.sort = [
      ...criteria?.sort?.filter((s) => s.property !== "gasStation.name"),
      ...[
        {
          property: "seller.gasStation.name",
          descending: byGasStationSorter.descending,
        },
        {
          property: "coverageOperator.gasStation.name",
          descending: byGasStationSorter.descending,
        },
        {
          property: "gasStationAdministrator.gasStation.name",
          descending: byGasStationSorter.descending,
        },
      ],
    ];
  }
  
  const [execute, { data, loading, error }] = useLazyQuery<IUsersResult>(
      LIST_USERS_QUERY,
      {
        variables: {
          filter: JSON.stringify(filter),
          max,
          skip,
          sort: JSON.stringify(criteria?.sort),
        },
      }
  );

  const users = data?.users.result;

  return { execute, users, loading, error };
}

export default useUsers;
