import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import { contactAPI } from '@/lib/api';

// ============ Types ============
export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface ContactsState {
  items: ContactSubmission[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: ContactsState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// ============ Async Thunks ============

// Fetch all contacts (admin only)
export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await contactAPI.getAll();
      return res.contacts || [];
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(err?.response?.data?.message || 'Failed to load submissions');
    }
  }
);

// Create new contact
export const createContact = createAsyncThunk(
  'contacts/create',
  async (data: { name: string; email: string; subject: string; message: string }, { rejectWithValue }) => {
    try {
      const res = await contactAPI.create(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to send message');
    }
  }
);

// Update contact status
export const updateContactStatus = createAsyncThunk(
  'contacts/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      await contactAPI.updateStatus(id, status);
      return { id, status };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to update status');
    }
  }
);

// Delete contact
export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await contactAPI.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to delete submission');
    }
  }
);

// ============ Slice ============
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearContacts: (state) => {
      state.items = [];
      state.lastFetched = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (action.payload !== 'unauthorized') {
          message.error(action.payload as string);
        }
      })
      // Create
      .addCase(createContact.fulfilled, () => {
        message.success('Message sent successfully!');
      })
      .addCase(createContact.rejected, (_, action) => {
        message.error(action.payload as string);
      })
      // Update status
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const contact = state.items.find((c) => c._id === id);
        if (contact) {
          contact.status = status;
        }
        message.success('Status updated');
      })
      .addCase(updateContactStatus.rejected, (_, action) => {
        message.error(action.payload as string);
      })
      // Delete
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
        message.success('Submission deleted');
      })
      .addCase(deleteContact.rejected, (_, action) => {
        message.error(action.payload as string);
      });
  },
});

export const { clearContacts } = contactsSlice.actions;

// ============ Selectors ============
export const selectContacts = (state: { contacts: ContactsState }) => state.contacts.items;
export const selectContactsLoading = (state: { contacts: ContactsState }) => state.contacts.loading;
export const selectShouldFetchContacts = (state: { contacts: ContactsState }) => {
  const { lastFetched, loading } = state.contacts;
  if (loading) return false;
  if (!lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export default contactsSlice.reducer;
