package mocks

import (
	"context"

	"github.com/influxdata/chronograf"
)

var _ chronograf.UsersStore = &UsersStore{}

// UsersStore mock allows all functions to be set for testing
type UsersStore struct {
	AllF    func(context.Context) ([]chronograf.DBUser, error)
	AddF    func(context.Context, *chronograf.DBUser) (*chronograf.DBUser, error)
	DeleteF func(context.Context, *chronograf.DBUser) error
	GetF    func(ctx context.Context, name string) (*chronograf.DBUser, error)
	UpdateF func(context.Context, *chronograf.DBUser) error
}

// All lists all users from the UsersStore
func (s *UsersStore) All(ctx context.Context) ([]chronograf.DBUser, error) {
	return s.AllF(ctx)
}

// Add a new User in the UsersStore
func (s *UsersStore) Add(ctx context.Context, u *chronograf.DBUser) (*chronograf.DBUser, error) {
	return s.AddF(ctx, u)
}

// Delete the User from the UsersStore
func (s *UsersStore) Delete(ctx context.Context, u *chronograf.DBUser) error {
	return s.DeleteF(ctx, u)
}

// Get retrieves a user if name exists.
func (s *UsersStore) Get(ctx context.Context, name string) (*chronograf.DBUser, error) {
	return s.GetF(ctx, name)
}

// Update the user's permissions or roles
func (s *UsersStore) Update(ctx context.Context, u *chronograf.DBUser) error {
	return s.UpdateF(ctx, u)
}
