// import fetch from 'node-fetch';
import {POST} from '../../../../api/redeem/[staffPassId]/route';
import {sql} from '@vercel/postgres';

jest.mock('@vercel/postgres', () => ({
    sql: {
      query: jest.fn(),
    },
  }));

describe('redeemGift', () => {
    afterEach(() => {
            jest.clearAllMocks();
        }
        );
            
    test('should return 404 if staff pass id not found', async () => {  
        const mockedQueryResult = {rows: []};
        (sql.query as jest.Mock).mockResolvedValue(mockedQueryResult);

        const request = {} as unknown as Request;
        const params = {
            staffPassId: '123456'
        }

        const response = await POST(request, {params});
        console.log(response)
        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({error: 'Staff pass id 123456 not found'});
    }
    );

    test('should return 409 if team has already redeemed', async () => {
        const mockedTeamNameQueryResult = {rows: [{team_name: 'team1'}]};
        const mockedRedemptionQueryResult = {rows: [{redemption_status: true}]};
        (sql.query as jest.Mock)
            .mockResolvedValueOnce(mockedTeamNameQueryResult)
            .mockResolvedValueOnce(mockedRedemptionQueryResult);

        const request = {} as unknown as Request;
        const params = {
            staffPassId: '123456'
        }

        const response = await POST(request, {params});
        expect(response.status).toBe(409);
        expect(await response.json()).toEqual({error: 'team1 has already redeemed'});
    }
    );

    test('should return 200 if team has not redeemed', async () => {
        const mockedTeamNameQueryResult = {rows: [{team_name: 'team1'}]};
        const mockedRedemptionQueryResult = {rows: []};
        (sql.query as jest.Mock)
            .mockResolvedValueOnce(mockedTeamNameQueryResult)
            .mockResolvedValueOnce(mockedRedemptionQueryResult);

        const request = {} as unknown as Request;
        const params = {
            staffPassId: '123456'
        }

        const response = await POST(request, {params});
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({message: 'Team redemption for team1 is still available'});
    }
    );

    test('should return 500 if error', async () => {
        (sql.query as jest.Mock).mockRejectedValue(new Error('error'));

        const request = {} as unknown as Request;
        const params = {
            staffPassId: '123456'
        }

        const response = await POST(request, {params});
        // console.log(response.json())
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({error: {}});
    }
    );




})

